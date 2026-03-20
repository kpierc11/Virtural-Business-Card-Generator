import { useState } from "react";
import Header from "../components/Header";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
    console.log(formData);

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
    //a.style.display = "none";
    a.href = url;
    a.download = "contact.vcf";
    //document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <Header></Header>
      <section className="flex justify-center items-center w-[100%] h-100 mt-50 ">
        <div className="grid grid-cols-2 gap-1 grow-1 justify-items-center">
          <div>
            <div className="card card-border bg-base-100 w-96 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
              <div className="card-body">
                <h2 className="text-3xl font-bold mb-5">
                  Virtual Card Settings
                </h2>
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleFormSubmit}
                >
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
                  <p className="validator-hint">Must be 10 digits</p>

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
                  <label className="label">Heading Color</label>
                  <div className="card card-border shadow-lg max-w-[100px]">
                    <input
                      type="color"
                      id="background"
                      name="background"
                      value="oklab(50% 0.1 0.1 / 0.5)"
                      colorspace="display-p3"
                      alpha
                    />
                  </div>
                  {/* Submit */}
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary" type="submit">
                      Create Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div>
            <div className="card card-border bg-base-100 w-96 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)] border-secondary">
              <div className="rounded-md">
                <div className="h-30 bg-primary rounded-xl m-1"></div>
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="avatar mt-[-60px]">
                      <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                        <img
                          src={
                            previewImage
                              ? previewImage
                              : "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                          }
                        />
                      </div>
                    </div>
                    <h2 className="ml-5 font-bold text-[24px]">
                      {formData.name ? formData.name : "Cat Smith"}
                    </h2>
                  </div>
                  <div className="mt-5">
                    <div className="flex flex-col">
                      <p>Phone:</p>
                      <p className="font-bold">
                        {formData.phone ? formData.phone : "423-552-5677"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>Email:</p>
                      <p className="font-bold">
                        {formData.email ? formData.email : "cat@gmail.com"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>Phone:</p>
                      <p className="font-bold">
                        {formData.phone ? formData.phone : "423-552-5677"}
                      </p>
                    </div>
                  </div>
                  <div className="card-actions justify-center">
                    <button className="btn btn-primary w-80 mt-10">
                      Add Contact
                    </button>
                  </div>
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
