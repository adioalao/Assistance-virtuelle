export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={` text-xl antialiased`}>
            {children}
         </body>
      </html>
   );
} 