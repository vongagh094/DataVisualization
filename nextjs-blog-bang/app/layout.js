import './style/global.css';

export const metadata = {
  title: 'Heart Disease Analysis',
  description: 'Heart Disease Analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
