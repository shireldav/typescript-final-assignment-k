interface LoadingProps {
  text?: string; // ?->optional, if not sent we use the default text
}

//appears while we wait for the server
export default function Loading({ text = "Loading..." }: LoadingProps) {
  return <p className="py-8 text-center text-slate-500">{text}</p>;
}
