module.exports = {
    getStats: (name, level) => {
        const allData = HeroData.getAllArtifactData();
        const artifact = allData[name];
        const baseHealth = artifact.stats.health;
        const baseAttack = artifact.stats.attack;
        const maxHealth = baseHealth * 13;
        const maxAttack = baseAttack * 13;

        const leveledHealth = (maxHealth - baseHealth) * (level/30) + baseHealth;
        const leveledAttack = (maxAttack - baseAttack) * (level/30) + baseAttack;

        return {
            health: Utils.round10ths(leveledHealth),
            attack: Utils.round10ths(leveledAttack)
        }
    },
}