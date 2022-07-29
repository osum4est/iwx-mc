import { glob } from "glob";
import fs from "fs";
import path from "path";

const tps = 20;
const BUILD_DIR = "build/gun_rebalance";

const AMMO_BRACKETS = {
    small: { dps: 4, ammo: "additionalguns:bullet_small", copper: 0.125 },
    medium: { dps: 10, ammo: "additionalguns:bullet_medium", copper: 0.25 },
    heavy: { dps: -1, ammo: "additionalguns:bullet_heavy", copper: 1 }
};

const IGNORE = ["bazooka", "grenade_launcher"];

const SWAP_AMMO_WHITELIST = [
    "additionalguns:bullet_small",
    "additionalguns:bullet_medium",
    "additionalguns:bullet_heavy",
    "additionalguns:bullet_short",
    "additionalguns:bullet_long",
    "additionalguns:bullet_special",
    "cgm:basic_bullet",
    "cgm:advanced_bullet"
];

let guns: {
    name: string;
    damage: number;
    oldDamage: number;
    rate: number;
    ammo: string;
    cpk: number;
    path: string;
    mod: string;
    data: any;
}[] = [];

if (fs.existsSync(BUILD_DIR)) fs.rmSync(BUILD_DIR, { recursive: true, force: true });
fs.mkdirSync(BUILD_DIR);

fs.writeFileSync(
    path.join(BUILD_DIR, "pack.mcmeta"),
    JSON.stringify({
        pack: {
            pack_format: 9,
            description: "Gun Rebalance"
        }
    })
);

for (const gunFile of glob.sync("src/helper_scripts/data/*/guns/*.json")) {
    const json = JSON.parse(fs.readFileSync(gunFile, "utf8"));

    const name = path.basename(gunFile, ".json");
    if (IGNORE.includes(name)) continue;

    guns.push({
        name,
        damage: json.projectile.damage,
        oldDamage: json.projectile.damage,
        rate: json.general.rate,
        ammo: json.projectile.item,
        cpk: -1,
        path: gunFile,
        mod: path.basename(path.resolve(gunFile, "../..")),
        data: json
    });
}

guns.sort((a, b) => b.damage - a.damage);
for (const gun of guns) {
    // Fix damage
    if (gun.rate >= 10) gun.damage /= 2.5;
    else gun.damage /= 4.5;
    gun.damage = Math.ceil(gun.damage * 4) / 4;

    // Fix ammo
    if (SWAP_AMMO_WHITELIST.includes(gun.ammo)) {
        let ammo;
        if (gun.rate >= 10 || getGunDps(gun) > 15) ammo = AMMO_BRACKETS.heavy;
        else if (gun.rate >= 8 || getGunDps(gun) >= 13) ammo = AMMO_BRACKETS.medium;
        else ammo = AMMO_BRACKETS.small;

        // Calculate copper per 20 damage
        const damageToKill = 20;
        const bulletsUsed = Math.ceil(damageToKill / gun.damage);
        gun.cpk = bulletsUsed * ammo.copper;
        gun.ammo = ammo.ammo;
    }

    const dir = path.join(BUILD_DIR, "data", gun.mod, "guns");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    gun.data.projectile.damage = gun.damage;
    gun.data.projectile.item = gun.ammo;
    fs.writeFileSync(path.join(dir, `${gun.name}.json`), JSON.stringify(gun.data, null, 2));
}

console.log("Guns by DPS:");
guns.sort((a, b) => getGunDps(b) - getGunDps(a));
for (const gun of guns) {
    logGun(gun);
}

console.log(`OP Guns:`);
for (const gun of guns) {
    if (gun.damage >= 10 || getGunDps(gun) >= 15) {
        console.log(`"${gun.mod}:${gun.name}",`);
    }
}

function getGunDps(gun: { damage: number; rate: number }) {
    const rateSeconds = gun.rate / tps;
    return gun.damage / rateSeconds;
}

function logGun(gun: { name: string; ammo: string; damage: number; oldDamage: number; rate: number; cpk: number }) {
    console.log(
        `DAM: ${gun.damage.toFixed(3)} (max: ${(gun.damage * 1.6).toFixed(2)}, was ${gun.oldDamage.toFixed(
            2
        )})\t| DPS: ${getGunDps(gun).toFixed(2)}\t| RATE: ${gun.rate.toFixed(2)}\t| CPK: ${gun.cpk}\t| ${gun.name}\t| ${
            gun.ammo
        }`
    );
}
