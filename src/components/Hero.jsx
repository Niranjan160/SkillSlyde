const Hero = ({
  title = "Find your right job that fits your skills and needs",
}) => {
  return (
    <section className="bg-indigo-600 py-12 sm:py-16 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {title}
          </h1>
          </div>
        </div>
    </section>
  );
};

export default Hero;
