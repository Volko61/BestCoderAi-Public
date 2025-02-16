import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface MessageRendererProps {
  content: string;
  timestamp: string;
  isUser: boolean;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, timestamp, isUser }) => {
  const {t} = useTranslation()
  const { theme } = useTheme();

  // Move the renderMessage function here
  const renderMessage = () => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <ReactMarkdown key={lastIndex} remarkPlugins={[remarkGfm]} >
            {content.slice(lastIndex, match.index)}
          </ReactMarkdown>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();

      parts.push(
        <div key={match.index} className="position-relative mb-2">
          <div className="d-flex justify-content-between align-items-center bg-dark p-2 rounded-top">
            <small className="text-muted">{language}</small>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              {t("MessageRenderer.Copy code")}
            </Button>
          </div>
          <SyntaxHighlighter language={language} style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <ReactMarkdown key={lastIndex} remarkPlugins={[remarkGfm]}>
          {content.slice(lastIndex)}
        </ReactMarkdown>
      );
    }

    return parts;
  };

  return (
    <Card className={`mt-3 ${isUser ? 'border-primary' : 'border-success'} ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Card.Header className={isUser ? 'bg-primary text-white' : 'bg-success text-white'}>
        {isUser ? t('MessageRenderer.You') : t('MessageRenderer.AI Assistant')}
      </Card.Header>
      <Card.Body>
        <div className="message-content">{renderMessage()}</div>
        <Card.Text className="text-muted small mt-2">
          {timestamp}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MessageRenderer;
