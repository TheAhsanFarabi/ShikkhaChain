const HeroSection = () => {
  return (
    <div
      className="w-full py-24 text-center text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://www.uiu.ac.bd/wp-content/uploads/2024/12/IMG_0098.jpg')" }}
    >
      <div className="bg-black bg-opacity-75 p-8 rounded-lg max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">
          Bangladesh's First Decentralized Certificate Verification
        </h1>
        <p className="mt-4 text-lg">
          Secure, Transparent, and Tamper-Proof Blockchain Solution
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
