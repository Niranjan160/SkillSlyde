const Hero = ({
  title = "Find your right job that fits your skills and needs",
  // subtitle ="Find your right job that fits your skills and needs!"
}) => {
  return (
    <section className="bg-indigo-600 py-12 sm:py-16 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {title}
          </h1>
          {/* Optional subtitle */}
          {/* <p className="my-4 text-lg sm:text-xl text-white">{subtitle}</p> */}
          {/* <div className="flex items-center justify-center mt-4"> */}
            {/* You can add an emoji or icon here if needed */}
            {/* <img className="h-6 w-auto ml-3" src={emoji} alt="" /> */}
          </div>
        </div>
      {/* </div> */}
      {/* Optional additional content (e.g., buttons, images) */}
      {/* <div className="flex justify-center mt-8"> */}
        {/* Add any call-to-action button or elements here */}
      {/* </div> */}
    </section>
  );
};

export default Hero;
