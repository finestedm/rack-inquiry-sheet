export default function generateRandomId() {
    return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000
}
