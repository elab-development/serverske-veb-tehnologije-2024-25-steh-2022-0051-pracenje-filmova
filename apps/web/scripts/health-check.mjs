const check = async () => {
  try {
    const response = await fetch("http://localhost:3000/");
    console.log("Healthy");
    process.exit(0);
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
};

await check();
