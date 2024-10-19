// This file sets up the layouts of the project 

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import './styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css';

export const metadata = {
  title: 'Project Connect',
  description: 'A sample project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
