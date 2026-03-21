import { useState } from "react";
import Header from "../components/Header";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    headingColor: "",
    websiteLink: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (event.target.files) {
      const testFile = event.target.files[0];
      const image = URL.createObjectURL(testFile);
      setPreviewImage(image);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${formData.name};;;;`,
      `FN:${formData.name}`,
      "ORG:Acme Inc.",
      "TITLE:Frontend Developer",
      `TEL;TYPE=CELL:${formData.phone}`,
      `EMAIL:${formData.email}`,
      "ADR;TYPE=HOME:;;123 Main St;Bristol;VA;24201;USA",
      "URL:https://johndoe.dev",
      "BDAY:19900101",
      "NOTE:Met at tech conference",
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact.vcf";
    a.click();

    URL.revokeObjectURL(a.href);
  };

  function handleVcfDownload(event: any): void {
    event.preventDefault();

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${formData.name};;;;`,
      `FN:${formData.name}`,
      "ORG:Acme Inc.",
      "TITLE:Frontend Developer",
      `TEL;TYPE=CELL:${formData.phone}`,
      `EMAIL:${formData.email}`,
      "ADR;TYPE=HOME:;;123 Main St;Bristol;VA;24201;USA",
      "URL:https://johndoe.dev",
      "BDAY:19900101",
      "NOTE:Met at tech conference",
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact.vcf";
    a.click();

    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <Header></Header>
      <section className="w-[100%] mt-20">
        <div className="flex flex-row flex-wrap gap-100 justify-center mr-2 ml-2">
          <div className="card card-border bg-base-100 h-[100%] w-96 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
            <div className="card-body">
              <h2 className="text-3xl font-bold mb-5">Virtual Card Settings</h2>
              <form className="flex flex-col gap-5" onSubmit={handleFormSubmit}>
                {/* Name */}
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
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
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

                {/* Phone */}
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

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Profile Image</legend>
                  <input
                    type="file"
                    className="file-input"
                    name="profileImage"
                    //value={formData.profileImage}
                    onChange={handleChange}
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
                      name="headingColor"
                      value={formData.headingColor}
                      onChange={handleChange}
                    />
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

          <div className="card card-border bg-base-100 w-96 h-[100%] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)] card-border">
            <div
              className="h-40 rounded-t-lg"
              style={
                formData.headingColor
                  ? { backgroundColor: formData.headingColor }
                  : { backgroundColor: "var(--color-secondary)" }
              }
            ></div>
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
                <div className=" flex flex-col gap-5 mt-5">
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
                        <p>Software Developer</p>
                        <p className="font-bold">{"Dpi Power"}</p>
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
                          className="size-6"
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
                    onClick={handleVcfDownload}
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

export default App;
