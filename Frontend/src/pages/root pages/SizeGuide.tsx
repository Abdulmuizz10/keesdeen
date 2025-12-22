import React, { useState } from "react";
import { Ruler, Info } from "lucide-react";

type MeasurementUnit = "cm" | "in";
type Gender = "mens" | "womens";
type Category = "tops" | "bottoms" | "shoes";

interface SizeData {
  size: string;
  chest?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  usSize?: number;
  ukSize?: number;
  euSize?: number;
}

const SizeGuide: React.FC = () => {
  const [unit, setUnit] = useState<MeasurementUnit>("cm");
  const [gender, setGender] = useState<Gender>("womens");
  const [category, setCategory] = useState<Category>("tops");

  // No conversion needed - store actual values for both units
  // const getValue = (cmValue: number, inValue: number): number => {
  //   return unit === "cm" ? cmValue : inValue;
  // };

  // Size data with actual measurements from the images
  const sizeData: Record<Gender, Record<Category, SizeData[]>> = {
    womens: {
      tops: [
        { size: "S", chest: 84, waist: 65, hips: 83 }, // cm values
        { size: "M", chest: 94, waist: 75, hips: 91 },
        { size: "L", chest: 104, waist: 85, hips: 101 },
        { size: "XL", chest: 114, waist: 93, hips: 111 },
        { size: "XXL", chest: 122, waist: 104, hips: 121 },
      ],
      bottoms: [
        { size: "S", waist: 65, hips: 83, inseam: 76 },
        { size: "M", waist: 75, hips: 91, inseam: 76 },
        { size: "L", waist: 85, hips: 101, inseam: 78 },
        { size: "XL", waist: 93, hips: 111, inseam: 78 },
        { size: "XXL", waist: 104, hips: 121, inseam: 79 },
      ],
      shoes: [
        { size: "35", ukSize: 2.5, usSize: 5, euSize: 35 },
        { size: "36", ukSize: 3.5, usSize: 6, euSize: 36 },
        { size: "37", ukSize: 4.5, usSize: 7, euSize: 37 },
        { size: "38", ukSize: 5.5, usSize: 8, euSize: 38 },
        { size: "39", ukSize: 6.5, usSize: 9, euSize: 39 },
        { size: "40", ukSize: 7, usSize: 9.5, euSize: 40 },
        { size: "41", ukSize: 8, usSize: 10.5, euSize: 41 },
        { size: "42", ukSize: 9, usSize: 11.5, euSize: 42 },
      ],
    },
    mens: {
      tops: [
        { size: "XS", chest: 86, waist: 71, hips: 86 },
        { size: "S", chest: 91, waist: 76, hips: 91 },
        { size: "M", chest: 96, waist: 81, hips: 96 },
        { size: "L", chest: 101, waist: 86, hips: 101 },
        { size: "XL", chest: 106, waist: 91, hips: 106 },
        { size: "XXL", chest: 111, waist: 96, hips: 111 },
      ],
      bottoms: [
        { size: "XS", waist: 71, hips: 86, inseam: 81 },
        { size: "S", waist: 76, hips: 91, inseam: 81 },
        { size: "M", waist: 81, hips: 96, inseam: 81 },
        { size: "L", waist: 86, hips: 101, inseam: 81 },
        { size: "XL", waist: 91, hips: 106, inseam: 81 },
        { size: "XXL", waist: 96, hips: 111, inseam: 81 },
      ],
      shoes: [
        { size: "39", ukSize: 6, usSize: 7, euSize: 39 },
        { size: "40", ukSize: 6.5, usSize: 7.5, euSize: 40 },
        { size: "41", ukSize: 7.5, usSize: 8.5, euSize: 41 },
        { size: "42", ukSize: 8.5, usSize: 9.5, euSize: 42 },
        { size: "43", ukSize: 9, usSize: 10, euSize: 43 },
        { size: "44", ukSize: 10, usSize: 11, euSize: 44 },
        { size: "45", ukSize: 11, usSize: 12, euSize: 45 },
        { size: "46", ukSize: 12, usSize: 13, euSize: 46 },
      ],
    },
  };

  // Corresponding inch values for women's measurements
  const womensInchData: Record<
    Category,
    Array<{ chest?: string; waist?: string; hips?: string; inseam?: number }>
  > = {
    tops: [
      { chest: "33.1 - 35", waist: "25.6 - 27.6", hips: "32.7 - 35" },
      { chest: "37 - 39", waist: "29.5 - 31.5", hips: "35.8 - 37.8" },
      { chest: "40.9 - 43.7", waist: "33.5 - 36.2", hips: "39.8 - 42.5" },
      { chest: "44.9 - 47.6", waist: "36.6 - 39.8", hips: "43.7 - 46.9" },
      { chest: "48 - 51.2", waist: "40.9 - 43.7", hips: "47.6 - 50.8" },
    ],
    bottoms: [
      { waist: "25.6 - 27.6", hips: "32.7 - 35", inseam: 30 },
      { waist: "29.5 - 31.5", hips: "35.8 - 37.8", inseam: 30 },
      { waist: "33.5 - 36.2", hips: "39.8 - 42.5", inseam: 31 },
      { waist: "36.6 - 39.8", hips: "43.7 - 46.9", inseam: 31 },
      { waist: "40.9 - 43.7", hips: "47.6 - 50.8", inseam: 31 },
    ],
    shoes: [],
  };

  // Corresponding cm range values for women's measurements
  const womensCmData: Record<
    Category,
    Array<{ chest?: string; waist?: string; hips?: string; inseam?: number }>
  > = {
    tops: [
      { chest: "84 - 89", waist: "65 - 70", hips: "83 - 89" },
      { chest: "94 - 99", waist: "75 - 80", hips: "91 - 96" },
      { chest: "104 - 111", waist: "85 - 92", hips: "101 - 108" },
      { chest: "114 - 121", waist: "93 - 101", hips: "111 - 119" },
      { chest: "122 - 130", waist: "104 - 111", hips: "121 - 129" },
    ],
    bottoms: [
      { waist: "65 - 70", hips: "83 - 89", inseam: 76 },
      { waist: "75 - 80", hips: "91 - 96", inseam: 76 },
      { waist: "85 - 92", hips: "101 - 108", inseam: 78 },
      { waist: "93 - 101", hips: "111 - 119", inseam: 78 },
      { waist: "104 - 111", hips: "121 - 129", inseam: 79 },
    ],
    shoes: [],
  };

  const currentData = sizeData[gender][category];

  const formatValue = (
    idx: number,
    field: "chest" | "waist" | "hips" | "inseam"
  ) => {
    if (gender === "womens" && category !== "shoes") {
      const dataSource = unit === "cm" ? womensCmData : womensInchData;
      const rowData = dataSource[category][idx];
      return rowData?.[field] || "";
    }

    // For men's, use the convert function
    const row = currentData[idx];
    const value = row[field];
    if (value === undefined) return "";
    return unit === "cm" ? value : Math.round((value / 2.54) * 10) / 10;
  };

  return (
    <section className="placing">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">
          <span>Size Guide</span>
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl mx-auto">
          Find your perfect fit with our comprehensive sizing charts and
          measurement guide.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Gender Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setGender("womens")}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors border ${
              gender === "womens"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Women's
          </button>
          <button
            onClick={() => setGender("mens")}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors border ${
              gender === "mens"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Men's
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setUnit("cm")}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors border ${
              unit === "cm" ? "bg-black text-white" : "bg-white text-gray-700"
            }`}
          >
            CM
          </button>
          <button
            onClick={() => setUnit("in")}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors border ${
              unit === "in" ? "bg-black text-white" : "bg-white text-gray-700"
            }`}
          >
            IN
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex gap-2 justify-center flex-wrap">
        {(["tops", "bottoms", "shoes"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors ${
              category === cat
                ? "bg-black text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Size Chart */}
      <div className="bg-white border border-gray-200 overflow-x-auto mb-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                Size
              </th>
              {category === "shoes" ? (
                <>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                    UK
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                    US
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                    EU
                  </th>
                </>
              ) : (
                <>
                  {category === "tops" && (
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                      {gender === "womens" ? "Bust" : "Chest"} ({unit})
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                    Waist ({unit})
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                    {gender === "womens" ? "Hip" : "Hips"} ({unit})
                  </th>
                  {category === "bottoms" && (
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-700 font-normal">
                      Inseam ({unit})
                    </th>
                  )}
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{row.size}</td>
                {category === "shoes" ? (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.ukSize}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.usSize}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.euSize}
                    </td>
                  </>
                ) : (
                  <>
                    {row.chest !== undefined && (
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatValue(idx, "chest")}
                      </td>
                    )}
                    {row.waist !== undefined && (
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatValue(idx, "waist")}
                      </td>
                    )}
                    {row.hips !== undefined && (
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatValue(idx, "hips")}
                      </td>
                    )}
                    {row.inseam !== undefined && (
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatValue(idx, "inseam")}
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to Measure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="w-5 h-5" />
            <h2 className="text-xl font-normal">How to Measure</h2>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium mb-2">
                {gender === "womens" ? "Bust" : "Chest"}
              </h3>
              <p>
                Measure around the fullest part of your{" "}
                {gender === "womens" ? "bust" : "chest"}, keeping the tape
                measure horizontal.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Waist</h3>
              <p>
                Measure around your natural waistline, keeping the tape
                comfortably loose.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                {gender === "womens" ? "Hip" : "Hips"}
              </h3>
              <p>
                Measure around the fullest part of your{" "}
                {gender === "womens" ? "hip" : "hips"}, approximately 20cm below
                your waist.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Inseam</h3>
              <p>
                Measure from the top of your inner thigh to the bottom of your
                ankle.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5" />
            <h2 className="text-xl font-normal">Fit Tips</h2>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium mb-2">Between Sizes?</h3>
              <p>
                If you're between sizes, we recommend sizing up for a more
                comfortable fit.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Product-Specific Fit</h3>
              <p>
                Some items may have a specific fit (oversized, slim, etc.).
                Check the product description for details.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Still Unsure?</h3>
              <p>
                Contact our customer service team at hello@keesdeen.com for
                personalized sizing advice.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Free Returns</h3>
              <p>
                Not the right fit? We offer free returns within 14 days (UK
                only).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-8">Need help finding your size?</p>
        <button className="border border-gray-900 bg-gray-900 px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default SizeGuide;
