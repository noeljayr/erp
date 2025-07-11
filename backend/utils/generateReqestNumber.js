const generateUniqueRequestNumber = async () => {
    const min = 10000;
    const max = 99999;
    let unique = false;
    let attempt = 0;
    let number;
  
    while (!unique && attempt < 10) {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
      const exists = await Request.exists({ requestNumber: number });
      if (!exists) {
        unique = true;
      }
      attempt++;
    }
  
    if (!unique) {
      throw new Error('Failed to generate a unique request number after multiple attempts.');
    }
  
    return number;
  };
  