export default function Footer() {
    return (
        <footer className="bg-surface py-4 ">
        <div className="container mx-auto text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} Aivify 
        </div>
        </footer>
    );
    }