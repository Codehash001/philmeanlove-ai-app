import Darkmodebutton from '../components/darkmode';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-4  items-center justify-center w-full">
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
