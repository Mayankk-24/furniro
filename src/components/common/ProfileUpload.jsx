import { useRef, useState } from "react";

const ProfileUpload = ({ setimage }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            setimage(file);
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleClear = () => {
        setPreview(null);
        fileInputRef.current.value = "";
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <div className="flex flex-col flex-wrap items-center gap-3 sm:gap-5">
                <div className="group" onClick={handleUploadClick}>
                    {preview ? (
                        <div className="size-28 md:size-36">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    ) : (
                        <span className="group-has-[div]:hidden flex shrink-0 justify-center items-center size-28 md:size-36 border-2 border-dotted border-gray-300 text-gray-400 cursor-pointer rounded-full hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--solar minimal__iconify__root css-1v5dgsl" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="#919EAB" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 10.25a.75.75 0 0 1 .75.75v1.25H14a.75.75 0 0 1 0 1.5h-1.25V15a.75.75 0 0 1-1.5 0v-1.25H10a.75.75 0 0 1 0-1.5h1.25V11a.75.75 0 0 1 .75-.75"></path><path d="M9.778 21h4.444c3.121 0 4.682 0 5.803-.735a4.4 4.4 0 0 0 1.226-1.204c.749-1.1.749-2.633.749-5.697s0-4.597-.749-5.697a4.4 4.4 0 0 0-1.226-1.204c-.72-.473-1.622-.642-3.003-.702c-.659 0-1.226-.49-1.355-1.125A2.064 2.064 0 0 0 13.634 3h-3.268c-.988 0-1.839.685-2.033 1.636c-.129.635-.696 1.125-1.355 1.125c-1.38.06-2.282.23-3.003.702A4.4 4.4 0 0 0 2.75 7.667C2 8.767 2 10.299 2 13.364s0 4.596.749 5.697c.324.476.74.885 1.226 1.204C5.096 21 6.657 21 9.778 21M16 13a4 4 0 1 1-8 0a4 4 0 0 1 8 0m2-3.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5z"></path></g></svg>
                        </span>
                    )}
                </div>

                <div className="grow">
                    <div className="flex flex-col gap-y-2 items-center md:flex-row md:gap-x-2">
                        <button
                            type="button"
                            className="py-2 px-2 md:px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleUploadClick}
                        >
                            <svg
                                className="shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" x2="12" y1="3" y2="15"></line>
                            </svg>
                            Upload photo
                        </button>
                        <button
                            type="button"
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            onClick={handleClear}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpload;