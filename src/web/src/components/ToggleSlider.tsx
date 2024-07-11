const ToggleSlider = ({ preview, setPreview }: { preview: boolean, setPreview: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const togglePreview = () => setPreview(prev => !prev);

    return (
      <div
        onClick={togglePreview}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
          preview ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
        } transition-colors duration-500 ease-out`}
      >
        <div className="w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ease-out"></div>
      </div>
    );
};

export default ToggleSlider;