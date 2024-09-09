import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full h-screen min-h-full grid grid-cols-2">
      <div className="w-full h-full bg-muted">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[70%] h-[70%]">
          <iframe
            className="w-full h-full"
            src="https://lottie.host/embed/b3d5c58a-c6ff-4173-a69d-c4cd7c42d52f/SxRumuNYKl.json"
          ></iframe>
        </div>
      </div>
      </div>
      <div className="w-full h-full bg-background flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
