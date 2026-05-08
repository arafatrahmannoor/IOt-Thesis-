const TextEditorContentPreview = ({ content }: any) => {
  return (
    <div
      className="text-editor space-y-5"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TextEditorContentPreview;
