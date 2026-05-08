import { Button, Input, Select } from "antd";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksInputProps {
  value?: { [key: string]: string };
  onChange?: (value: { [key: string]: string }) => void;
}

const SocialLinksInput: React.FC<SocialLinksInputProps> = ({
  value = {},
  onChange,
}) => {
  const socialPlatforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
  ];

  const socialLinks: SocialLink[] = Object.entries(value).map(
    ([platform, url]) => ({
      platform,
      url,
    })
  );

  const handleAddLink = () => {
    // Find the first available platform
    const usedPlatforms = socialLinks.map((link) => link.platform);
    const availablePlatform = socialPlatforms.find(
      (platform) => !usedPlatforms.includes(platform.value)
    );

    if (availablePlatform) {
      const newLinks = [
        ...socialLinks,
        { platform: availablePlatform.value, url: "" },
      ];
      const newValue = newLinks.reduce((acc, link) => {
        acc[link.platform] = link.url;
        return acc;
      }, {} as { [key: string]: string });
      onChange?.(newValue);
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    const newValue = newLinks.reduce((acc, link) => {
      if (link.url.trim()) {
        acc[link.platform] = link.url;
      }
      return acc;
    }, {} as { [key: string]: string });
    onChange?.(newValue);
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const newLinks = [...socialLinks];
    // Check if this platform is already used by another link
    const isPlatformUsed = newLinks.some(
      (link, i) => i !== index && link.platform === platform
    );

    if (!isPlatformUsed) {
      newLinks[index].platform = platform;
      const newValue = newLinks.reduce((acc, link) => {
        acc[link.platform] = link.url;
        return acc;
      }, {} as { [key: string]: string });
      onChange?.(newValue);
    }
  };

  const handleUrlChange = (index: number, url: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = url;
    const newValue = newLinks.reduce((acc, link) => {
      acc[link.platform] = link.url;
      return acc;
    }, {} as { [key: string]: string });
    onChange?.(newValue);
  };

  const getAvailablePlatforms = (currentIndex: number) => {
    const usedPlatforms = socialLinks
      .map((link, index) => (index !== currentIndex ? link.platform : null))
      .filter(Boolean);

    return socialPlatforms.filter(
      (platform) => !usedPlatforms.includes(platform.value)
    );
  };

  return (
    <div className="space-y-3">
      {socialLinks.map((link, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">
            <Select
              value={link.platform}
              onChange={(value) => handlePlatformChange(index, value)}
              className="w-full"
              placeholder="Select platform"
              options={getAvailablePlatforms(index)}
            />
          </div>
          <div className="flex-2">
            <Input
              value={link.url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Enter URL"
              className="w-full"
            />
          </div>
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleRemoveLink(index)}
            className="flex-shrink-0"
          />
        </div>
      ))}

      <Button
        type="dashed"
        icon={<Plus className="w-4 h-4" />}
        onClick={handleAddLink}
        className="w-full"
        disabled={socialLinks.length >= socialPlatforms.length}
      >
        Add Social Link
      </Button>
    </div>
  );
};

export default SocialLinksInput;
