import { readFile } from 'fs/promises';
import { join } from 'path';

async function getSubscribers() {
  try {
    const filePath = join(process.cwd(), 'data', 'subscribers.json');
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
}

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div style={{ padding: `calc(var(--header-h, 4.5rem) + 2rem) 2rem 2rem 2rem`, maxWidth: '800px', margin: '0 auto' }}>
      <h1>Newsletter Subscribers</h1>
      <p>Total subscribers: {subscribers.length}</p>
      
      {subscribers.length === 0 ? (
        <p>No subscribers yet. Test the newsletter form on the homepage!</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Subscribed At</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{subscriber.email}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {new Date(subscriber.subscribedAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{subscriber.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Testing Instructions:</h3>
        <ol>
          <li>Go to the homepage and wait for the newsletter modal to appear (or clear localStorage to force it)</li>
          <li>Enter a test email address and submit</li>
          <li>Check this page to see if the email was saved</li>
          <li>Try submitting the same email again to test duplicate prevention</li>
        </ol>
      </div>
    </div>
  );
}
