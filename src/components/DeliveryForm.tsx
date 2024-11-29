import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State } from "country-state-city";
import { Button } from "@relume_io/relume-ui";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext/AuthContext";

// const zipCodePatterns: { [key: string]: RegExp } = {
//   US: /^[0-9]{5}(-[0-9]{4})?$/,
//   CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
//   UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
//   AU: /^\d{4}$/,
//   IN: /^\d{6}$/,
// };

interface DeliveryFormProps {
  selectedCountry: string;
  selectedState: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
  handleDeliverySubmit: (data: any) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  selectedCountry,
  selectedState,
  setSelectedCountry,
  setSelectedState,
  handleDeliverySubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useContext(AuthContext);

  const validateZipCode = (zip: string) => {
    // Regex for postal codes (3–12 characters, alphanumeric, spaces, and hyphens allowed)
    const universalPattern = /^[A-Za-z0-9 -]{3,12}$/;
    if (!zip.trim()) return "Zip code is required";
    return universalPattern.test(zip.trim()) || "Invalid postal code format";
  };

  React.useEffect(() => {
    register("phoneNumber", {
      required: "Phone number is required",
      validate: (value) => value.length >= 10 || "Invalid phone number",
    });
  }, [register]);

  const onSubmit = (data: any) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields!", {
        autoClose: 3000,
      });
    } else {
      handleDeliverySubmit(data); // Call the prop function if needed
    }
  };

  return (
    <>
      <form className="grid grid-cols-2 gap-3 w-full poppins">
        {!user && (
          <>
            <div className="relative w-full mb-1 max-md:col-span-2">
              <label>First Name</label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                type="text"
                placeholder="First name"
                className="border border-border-secondary px-2 py-3 w-full rounded-md"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.firstName.message)}
                </p>
              )}
            </div>

            <div className="relative w-full mb-1 max-md:col-span-2">
              <label>Last Name</label>
              <input
                {...register("lastName", {
                  required: "Last name is required",
                })}
                type="text"
                placeholder="Last name"
                className="border border-border-secondary px-2 py-3 w-full rounded-md"
              />
              {errors.lastName && (
                <p className="absolute text-red-500 text-sm mt-1">
                  {String(errors.lastName.message)}
                </p>
              )}
            </div>
          </>
        )}

        <div className="relative w-full mb-1 max-md:col-span-2">
          <label>Country</label>
          <select
            {...register("country", { required: "Country is required" })}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
          >
            <option value="">Select country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full mb-1 max-md:col-span-2">
          <label>State / Region</label>
          <select
            {...register("cityAndRegion", {
              required: "City or Region is required",
            })}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
          >
            <option value="">Select city/region</option>
            {State.getStatesOfCountry(selectedCountry).map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* address */}
        <div className="relative w-full mb-1 max-md:col-span-2">
          <label>Address Line One</label>
          <input
            {...register("addressLineOne", {
              required: "Address is required",
            })}
            type="text"
            placeholder="Address line one"
            className="border border-border-secondary px-2 py-3 w-full rounded-md"
          />
          {errors.addressLineOne && (
            <p className="absolute text-red-500 text-sm mt-1">
              {String(errors.addressLineOne.message)}
            </p>
          )}
        </div>

        <div className="relative w-full mb-1 max-md:col-span-2">
          <div className="flex items-center gap-1">
            <label>Address Line Two </label>
            <span className="hidden md:flex">(optional)</span>
          </div>
          <input
            {...register("addressLineTwo")}
            type="text"
            placeholder="Address line two optional"
            className="border border-border-secondary px-2 py-3 w-full rounded-md "
          />
        </div>

        {/* Add more fields as required */}

        <div className="relative w-full mb-1 max-md:col-span-2">
          <label>Phone Number</label>
          <PhoneInput
            country="us"
            value={watch("phoneNumber")}
            onChange={(phone) =>
              setValue("phoneNumber", phone, { shouldValidate: true })
            }
            inputClass="w-full border border-border-secondary px-2 py-6 rounded-md"
            containerClass="w-full"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.phoneNumber.message)}
            </p>
          )}
        </div>

        {/* Zip Code */}
        <div className="relative w-full mb-1 max-md:col-span-2">
          <label>Zip Code / Postal code</label>
          <input
            {...register("zipCode", {
              required: "Zip code is required",
              validate: validateZipCode, // Hooking the custom validation
            })}
            type="text"
            placeholder="Zip code / Postal code"
            maxLength={12} // Preventing user input beyond 12 characters
            className="border border-border-secondary px-2 py-3 w-full rounded-md"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.zipCode.message)}
            </p>
          )}
        </div>
      </form>
      <Button
        className="bg-brand-neutral text-white text-xl rounded-md py-3 px-10 w-full mt-4"
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </>
  );
};

export default DeliveryForm;
