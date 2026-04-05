import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    color: "",
    websiteLink: "",
    companyName: "",
    jobTitle: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setPreviewImage(image);
    } else {
      setPreviewImage("");
    }
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setPreviewBackgroundImage(image);
    } else {
      setPreviewBackgroundImage("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const uniqueID = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    formData.id = uniqueID;

    setIsLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}add-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      await new Promise((r) => {
        setTimeout(r, 2000);
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
      setShowQRCode(true);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector("#qr-code");
    if (!svg) {
      return;
    }
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(source);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width || 300;
      canvas.height = img.height || 300;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const jpegUrl = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = jpegUrl;
      link.download = "qr-code.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  if (isLoading) {
    return (
      <>
        <div className="w-[100%] h-[400px] mt-20 flex flex-col justify-center items-center">
          <p className="mb-2">Creating QR Code...</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </>
    );
  }

  if (showQRCode) {
    return (
      <>
        <div className="w-[100%] h-[400px] mt-40 flex flex-col justify-center items-center">
          <div className="card card-border bg-base-100 p-10">
            <QRCodeSVG
              id="qr-code"
              width="300"
              height="300"
              value={`${import.meta.env.VITE_BASE_URL}virtual-card/${formData.id}`}
            />
            <button
              className="btn btn-primary mt-10"
              onClick={handleDownloadQR}
            >
              Download QR Code
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="w-[100%] mt-20 mb-50">
        <div className="grid justify-items-center grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 gap-2 mr-2 ml-2 p-2 md:p-10">
          <div className="w-[100%] h-[100%] justify-center items-center">
            <div className=" items-center w-[100%]">
              <form
                className="flex flex-col items-center gap-5 w-[100%]"
                onSubmit={handleFormSubmit}
              >
                {/* Name */}
                <div className="card card-border card-body items-center gap-5 bg-base-100 w-[100%] max-w-[70%] pb-20 shadow-sm">
                  <h2 className="text-3xl font-bold mb-5">
                    General Information
                  </h2>
                  <div className="flex flex-row justify-center gap-5 w-[100%]">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="input"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    {/* Email */}
                    <label className="input validator">
                      <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          ></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                      </svg>
                      <input
                        type="email"
                        name="email"
                        placeholder="mail@site.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </label>
                    <div className="validator-hint hidden">
                      Enter valid email address
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-row justify-center gap-5 w-[100%]">
                    <label className="input validator">
                      <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                      >
                        <g fill="none">
                          <path
                            d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                            fill="currentColor"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                      <input
                        type="tel"
                        name="phone"
                        className="tabular-nums"
                        required
                        placeholder="Phone"
                        pattern="[0-9]*"
                        title="Must be 10 digits"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </label>
                    <div className="validator-hint hidden mt-0">
                      Must be 10 digits
                    </div>
                    <label className="input validator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>

                      <input
                        type="text"
                        name="websiteLink"
                        placeholder="Website Url"
                        required
                        value={formData.websiteLink}
                        onChange={handleChange}
                      />
                    </label>
                  </div>

                  <div className="flex flex-row justify-center gap-5 w-[100%]">
                    <label className="input validator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                        />
                      </svg>

                      <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="input validator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                        />
                      </svg>

                      <input
                        type="text"
                        name="jobTitle"
                        placeholder="Job Title"
                        required
                        value={formData.jobTitle}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="card card-border items-center bg-base-100 card-body flex gap-2 shadow-sm w-[100%] max-w-[70%] pb-20">
                  <h2 className="text-3xl font-bold mb-5">Images</h2>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Profile Image</legend>
                    <input
                      type="file"
                      className="file-input"
                      name="profileImage"
                      //value={formData.profileImage}
                      onChange={handleProfileImageChange}
                    />
                    <label className="label">Max size 2MB</label>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Background Image
                    </legend>
                    <input
                      type="file"
                      className="file-input"
                      name="backgroundImage"
                      //value={formData.profileImage}
                      onChange={handleBackgroundImageChange}
                    />
                    <label className="label">Max size 2MB</label>
                  </fieldset>
                  <label className="label font-bold">Heading Color</label>
                  <div className="card card-border shadow-lg max-w-[50px]">
                    <div className="card-body items-center p-1">
                      <input
                        className="cursor-pointer max-w-[30px] rounded-full"
                        type="color"
                        id="background"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Submit */}
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" type="submit">
                    Create QR Code
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card card-border shadow-sm sticky top-20 justify-center bg-base-100 w-[100%] max-w-[430px] max-h-[700px] ">
            {previewBackgroundImage ? (
              <div className="h-40 rounded-t-lg relative">
                <img
                  className="h-40 w-100 cover"
                  src={previewBackgroundImage}
                ></img>
                <div
                  className="absolute w-[100%] h-40 top-0 opacity-95 rounded-t-lg"
                  style={
                    formData.color
                      ? { backgroundColor: formData.color }
                      : { backgroundColor: "var(--color-secondary)" }
                  }
                ></div>
              </div>
            ) : (
              <div
                className="h-40 rounded-t-lg"
                style={
                  formData.color
                    ? { backgroundColor: formData.color }
                    : { backgroundColor: "var(--color-secondary)" }
                }
              ></div>
            )}

            <div className="card-body rounded-md">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="avatar mt-[-100px]">
                    <div className="ring-secondary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                      <img
                        src={
                          previewImage
                            ? previewImage
                            : "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                        }
                      />
                    </div>
                    <h2 className="ml-5 font-bold text-[24px] text-white">
                      {formData.name ? formData.name : "Cat Smith"}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col gap-5 mt-5">
                  <div className="card card-border flex flex-col">
                    <div className="card-body flex-row items-center p-2">
                      <div className="bg-secondary rounded-[99px] p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p>
                          {formData.jobTitle
                            ? formData.jobTitle
                            : "Software Developer"}
                        </p>
                        <p className="font-bold">
                          {formData.companyName
                            ? formData.companyName
                            : "Dpi Power"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card card-border flex flex-col">
                    <div className="card-body flex-row items-center p-2">
                      <div className="bg-secondary rounded-[99px] p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="white"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p>Phone</p>
                        <p className="font-bold">
                          {formData.phone ? formData.phone : "423-552-5677"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card card-border flex flex-col">
                    <div className="card-body flex-row items-center p-2">
                      <div className="bg-secondary rounded-[99px] p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                          />
                        </svg>
                      </div>
                      <div>
                        <p>Email</p>
                        <p className="font-bold">
                          {formData.email ? formData.email : "cat@gmail.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card card-border flex flex-col">
                    <div className="card-body flex-row items-center p-2">
                      <div className="bg-secondary rounded-[99px] p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                      </div>
                      <div>
                        <p>Website</p>
                        <a className="font-bold" href="#">
                          {formData.websiteLink
                            ? formData.websiteLink
                            : "catwebsite.com"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-center">
                  <button
                    onClick={() => {}}
                    className="btn btn-secondary mt-10 add-button-vcf"
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
