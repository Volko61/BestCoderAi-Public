from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore, credentials
import google.cloud.firestore
from flask import jsonify
# from openai import OpenAI
from groq import Groq
import json
import stripe
import os
import tiktoken
from typing import List, Dict


# Initialize Firebase Admin SDK
cred = credentials.ApplicationDefault()

# stripe.api_key = os.environ.get('sk_live_XXX')
stripe.api_key = 'sk_liveXX'
# endpoint_secret = os.environ.get('whsec_XXX')
endpoint_secret = 'whsec_XX'


app = initialize_app(cred)

# Initialize tiktoken encoder globally
encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")

def allow_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@https_fn.on_request()
def addmessage(req: https_fn.Request) -> https_fn.Response:
    """Take the text parameter passed to this HTTP endpoint and insert it into
    a new document in the messages collection."""
    # Handle CORS preflight request
    if req.method == 'OPTIONS':
        return allow_cors(https_fn.Response('', status=204))

    # Grab the text parameter.
    original = req.args.get("text")
    if original is None:
        return allow_cors(https_fn.Response("No text parameter provided", status=400))

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("messages").add({"original": original})

    # Send back a message that we've successfully written the message
    return allow_cors(https_fn.Response(f"Message with ID {doc_ref.id} added."))

def count_tokens(text: str) -> int:
    """Count the number of tokens in a string."""
    return len(encoder.encode(text))

def count_message_tokens(messages: List[Dict[str, str]]) -> int:
    """Count the number of tokens in a list of messages."""
    num_tokens = 0
    for message in messages:
        for key, value in message.items():
            num_tokens += count_tokens(value)
            if key == "name":  # If there's a name, the role is omitted
                num_tokens -= 1  # Role is always required and always 1 token
    num_tokens += 2  # Every reply is primed with <im_start>assistant
    return num_tokens

@https_fn.on_request()
def stream_llm_response(request):
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return allow_cors(https_fn.Response('', status=204))

    if request.method != 'POST':
        return allow_cors(https_fn.Response('Method Not Allowed', status=405))

    # Get user ID from request
    user_id = request.json['user']
    is_trial = request.json.get('trial', False)
    
    # Get IP address from the request
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip_address:
        ip_address = ip_address.split(',')[0].strip()

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Count tokens in the input message
    input_tokens = count_message_tokens(request.json['message'])
    if input_tokens > 30000:
        return allow_cors(https_fn.Response(json.dumps({'error': 'Input message is too long'}), status=400))

    if is_trial:
        # Handle trial users
        trial_ref = firestore_client.collection("trial_users").document(ip_address)
        trial_doc = trial_ref.get()

        if not trial_doc.exists:
            trial_ref.set({'token_count': input_tokens})
            trial_ref.set({'messages': 1})
        else:
            token_count = trial_doc.to_dict().get('token_count', 0)
            if token_count + input_tokens > 200000:  # Limit trial users to 20,000 tokens total
                return allow_cors(https_fn.Response(json.dumps({'error': 'Free trial limit reached'}), status=403))
            trial_ref.update({'token_count': firestore.Increment(input_tokens)})
            trial_ref.update({'messages': firestore.Increment(1)})

        max_output_tokens = 20000  # Default for trial users
    else:
        # Check if user is premium
        subscriptions_ref = firestore_client.collection("customers").document(user_id).collection("subscriptions")
        active_subscriptions = subscriptions_ref.get()

        if not active_subscriptions:
            return allow_cors(https_fn.Response(json.dumps({'error': 'Not a premium user'}), status=403))

        # Check user's token balance
        user_ref = firestore_client.collection("customers").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return allow_cors(https_fn.Response(json.dumps({'error': 'User not found'}), status=404))

        tokens_left = user_doc.to_dict().get('tokensLeft', 0)
        max_output_tokens = min(request.json.get('max_tokens', 8191), 8191)  # Cap at 38,000 tokens

        if tokens_left < input_tokens + max_output_tokens:
            return allow_cors(https_fn.Response(json.dumps({'error': 'Insufficient tokens'}), status=403))
        user_ref.update({'messages': firestore.Increment(1)})

    client = Groq(api_key="gsk_7XX")
    # client = Groq(api_key="sk-XX0", base_url="https://api.deepseek.com")

    try:
        response = client.chat.completions.create(
            # model="deepseek-coder",
            model="llama-3.2-90b-text-preview",
            messages=request.json['message'],
            max_tokens=min(max_output_tokens, 8191), 
            stream=True,
            stop=None,
        )

        def generate():
            output_tokens = 0
            output_text = ""
            for chunk in response:
                if chunk.choices[0].delta.content:
                    # Append the content only if it's not None
                    content = chunk.choices[0].delta.content
                    output_text += content
                    new_output_tokens = count_tokens(output_text)
                    if new_output_tokens > 30000:
                        yield f"data: {json.dumps({'error': 'Response too long'})}\n\n"
                        break
                    output_tokens = new_output_tokens
                    yield f"data: {json.dumps({'content': output_text})}\n\n"
            
            total_tokens_used = input_tokens + output_tokens
            
            # Update user's token balance if not a trial user
            if not is_trial:
                user_ref.update({'tokensLeft': firestore.Increment(-total_tokens_used)})
            else:
                trial_ref.update({'token_count': firestore.Increment(output_tokens)})

            yield f"data: {json.dumps({'tokens_used': total_tokens_used})}\n\n"

        return allow_cors(https_fn.Response(
            generate(),
            mimetype='text/event-stream'
        ))

    except Exception as e:
        print(f'LLM API Error: {str(e)}')
        return allow_cors(https_fn.Response(json.dumps({'error': 'Failed to fetch response from LLM'}), status=500))
# Update the token number when user pays at the begining of the month
@https_fn.on_request()
def handle_stripe_webhook(request: https_fn.Request) -> https_fn.Response:
    payload = request.data.decode('utf-8')
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return https_fn.Response('Invalid payload', status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return https_fn.Response('Invalid signature', status=400)

    # Handle the event
    if event['type'] in ['customer.subscription.created', 'customer.subscription.renewed', 'invoice.paid']:
        customer_id = event['data']['object']['customer']
        update_user_tokens(customer_id)
    else:
        print(f'Unhandled event type {event["type"]}')

    return https_fn.Response('Received', status=200)

def update_user_tokens(stripe_customer_id: str):
    db = firestore.client()
    
    try:
        # Fetch the Stripe customer to get the firebaseUID
        stripe_customer = stripe.Customer.retrieve(stripe_customer_id)
        firebase_uid = stripe_customer.metadata.get('firebaseUID')
        
        if not firebase_uid:
            print(f'No firebaseUID found for Stripe customer: {stripe_customer_id}')
            return
        
        # Get the user document using the firebaseUID
        user_ref = db.collection('customers').document(firebase_uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            print(f'No user found with firebaseUID: {firebase_uid}')
            return
        
        # Update the user's tokens
        user_ref.update({
            'tokensLeft': 10000000,
            'lastTokenReset': firestore.SERVER_TIMESTAMP
        })
        print(f'Updated tokens for user: {firebase_uid}')
    except stripe.error.StripeError as e:
        print(f'Stripe error for customer {stripe_customer_id}: {str(e)}')
    except Exception as e:
        print(f'Error updating tokens for customer {stripe_customer_id}: {str(e)}')