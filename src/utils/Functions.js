export const getCurrentDate = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const monthDateString = (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
    return year + '-' + monthDateString;
}