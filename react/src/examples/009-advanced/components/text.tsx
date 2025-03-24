type TextProps = {
  content: string;
};

export function Text(props: TextProps) {
  return <div>{props.content}</div>;
}
