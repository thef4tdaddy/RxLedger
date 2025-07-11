import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function PrivacyPolicy() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/thef4tdaddy/RxLedger/main/docs/Privacy.md',
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
        console.error('Error fetching Privacy Policy:', error);
        setContent('Failed to load Privacy Policy.');
      });
  }, []);

  return (
    <section className="max-w-3xl mx-auto pt-8 pb-16 px-6 prose">
      <div
        className="[&_*]:text-gray-800 [&_h1]:text-blue-700 [&_h2]:text-blue-700 [&_h3]:text-blue-700 [&_a]:text-teal-600"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
