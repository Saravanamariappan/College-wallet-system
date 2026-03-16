import { db } from "./src/config/db.js";

const run = async () => {
    try {
        const [rows] = await db.query("SELECT email FROM users WHERE role = 'VENDOR' LIMIT 1");
        if (rows.length > 0) {
            console.log("VENDOR_EMAIL=" + rows[0].email);
        } else {
            console.log("NO_VENDOR_FOUND");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
