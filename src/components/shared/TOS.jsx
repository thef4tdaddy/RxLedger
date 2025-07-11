import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function TermsOfService() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/thef4tdaddy/RxLedger/main/docs/TOS.md',
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((markdown) => {
        setContent(marked.parse(markdown));
      })
      .catch((error) => {
        console.error('Error fetching Terms of Service:', error);
        setContent('Failed to load Terms of Service.');
      });
  }, []);

  return (
    <section className="max-w-3xl mx-auto pt-8 pb-16 px-6 prose prose-blue prose-headings:text-blue-700 prose-p:text-gray-800 prose-a:text-teal-600">
      <div
        className="[&_*]:text-gray-800 [&_h1]:text-blue-700 [&_h2]:text-blue-700 [&_h3]:text-blue-700 [&_a]:text-teal-600"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
