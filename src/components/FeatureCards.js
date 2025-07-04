const FeatureCards = () => {
  const features = [
    {
      title: "Trust & Security",
      desc: "Blockchain ensures certificates are tamper-proof and verifiable.",
      icon: "fa-shield-halved",
    },
    {
      title: "Instant Verification",
      desc: "Check certificate authenticity in seconds.",
      icon: "fa-bolt",
    },
    {
      title: "Decentralized & Transparent",
      desc: "No central authority. All data is immutable.",
      icon: "fa-network-wired",
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white p-6 shadow-lg rounded-lg text-center hover:shadow-xl transition-shadow"
        >
          <i className={`fas ${feature.icon} text-3xl text-green-600 mb-3`}></i>
          <h2 className="text-xl font-bold text-green-700">{feature.title}</h2>
          <p className="mt-2 text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
