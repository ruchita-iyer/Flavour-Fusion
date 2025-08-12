export default function Footer() {
  return (
    <footer className="py-6 px-6 md:px-8 border-t border-border/40 bg-background">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Recipe Browser. All rights reserved.</p>
      </div>
    </footer>
  );
}
