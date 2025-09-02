import React from "react";
import banner from "../images/bannerabout.jpg"
const About_us = () => {
    return (
        <div className="w-full">
            {/* Banner Section */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                <img
                    src={banner}
                    alt="About Us Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                        About Us
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Text */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Young’s
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Young’s started its operations in 1988 as a small food processing establishment in Karachi, Pakistan.
                        From the beginning, people working at Young’s had the vision and passion to raise Young’s to new heights with
                        products that meet the daily food needs of our consumers and offer high value of nutrition and convenience.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        The first product launched by Young’s was Mayonnaise which received tremendous acceptance and appreciation from Pakistani consumers.
                    </p>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        Another milestone in spreads category was “Young’s Chicken Spread” which was launched in 1989. Young’s was the first company to commercially
                        manufacture Chicken Spread in the world. The journey of successful launches continued with Sandwich Spread, Chocolate Spread, Cooking Chocolate,
                        Olive Spread, Dip Sauces and Natural Honey.


                        Today, Young’s enjoys successful brand leadership in Mayonnaise and Spreads category throughout Pakistan. Young’s is remarkably spreading in
                        various parts of the world.
                    </p>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src={banner}
                        alt="Our Team"
                        className="rounded-2xl shadow-xl w-full max-w-md object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default About_us;
