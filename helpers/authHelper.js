import bcrypt from 'bcrypt'

export const hashPassword = async(password) => {
    try{
        const salt=10;
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch(error){
        console.log(error)
    }
};

export const comparePassword=async (password,hashedPassword)=>{
    try {
        return await bcrypt.compare(password, hashedPassword);
      } catch (error) {
        console.log(error);
        throw new Error('Error comparing passwords');  // Optional: handling comparison error
      }
    };