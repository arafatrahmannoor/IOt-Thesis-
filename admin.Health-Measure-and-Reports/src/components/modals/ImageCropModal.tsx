import { Button, Modal } from "antd";
import React, { useRef, useState, useCallback } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropModalProps {
    open: boolean;
    onClose: () => void;
    imageSrc: string;
    onCropComplete: (croppedImageBlob: Blob) => void;
    fileName: string;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
    open,
    onClose,
    imageSrc,
    onCropComplete,
    fileName,
}) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90,
                },
                16 / 9,
                width,
                height
            ),
            width,
            height
        );
        setCrop(crop);
    }, []);

    const getCroppedImg = (
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        crop: PixelCrop
    ): Promise<Blob> => {
        return new Promise((resolve) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("No 2d context");
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const pixelRatio = window.devicePixelRatio;

            canvas.width = crop.width * pixelRatio;
            canvas.height = crop.height * pixelRatio;

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        throw new Error("Canvas is empty");
                    }
                    resolve(blob);
                },
                "image/jpeg",
                0.9
            );
        });
    };

    const handleCropComplete = async () => {
        if (!completedCrop || !imgRef.current || !canvasRef.current) {
            return;
        }

        setIsProcessing(true);
        try {
            const croppedImageBlob = await getCroppedImg(
                imgRef.current,
                canvasRef.current,
                completedCrop
            );
            onCropComplete(croppedImageBlob);
            onClose();
        } catch (error) {
            console.error("Error cropping image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        onClose();
    };

    return (
        <Modal
            open={open}
            title={`Crop Image - ${fileName}`}
            width={800}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    key="crop"
                    type="primary"
                    loading={isProcessing}
                    onClick={handleCropComplete}
                    disabled={!completedCrop}
                >
                    Crop & Use
                </Button>,
            ]}
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="max-w-full max-h-96 overflow-hidden">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        minWidth={100}
                        minHeight={100}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imageSrc}
                            onLoad={onImageLoad}
                            className="max-w-full max-h-96"
                        />
                    </ReactCrop>
                </div>

                <div className="text-sm text-gray-500 text-center">
                    <p>Drag to adjust the crop area. The image will be cropped to 16:9 aspect ratio.</p>
                </div>

                {/* Hidden canvas for processing */}
                <canvas
                    ref={canvasRef}
                    style={{
                        display: "none",
                    }}
                />
            </div>
        </Modal>
    );
};

export default ImageCropModal;


