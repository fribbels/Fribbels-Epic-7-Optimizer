package com.fribbels.db;

import com.fribbels.model.ArtifactStats;

import java.util.HashMap;
import java.util.Map;

public class ArtifactStatsDb {

    private Map<String, ArtifactStats> artifactStatsByName;

    public ArtifactStatsDb() {
        artifactStatsByName = new HashMap<>();
    }

    public ArtifactStats getArtifactStats(final String name, final int level) {
        final ArtifactStats base = artifactStatsByName.get(name);
        if (base == null) {
            return ArtifactStats.builder()
                                .attack(0f)
                                .health(0f)
                                // .defense(0f)
                                .build();
        }
    
        final float maxAttack = base.getAttack() * 13;
        final float maxHealth = base.getHealth() * 13;
        // final float maxDefense = base.getDefense() * 13;
    
        final float leveledAttack = (maxAttack - base.getAttack()) * (level / 30f) + base.getAttack();
        final float leveledHealth = (maxHealth - base.getHealth()) * (level / 30f) + base.getHealth();
        // final float leveledDefense = (maxDefense - base.getDefense()) * (level / 30f) + base.getDefense();
    
        return ArtifactStats.builder()
                            .attack(leveledAttack)
                            .health(leveledHealth)
                            // .defense(leveledDefense)
                            .build();
    }
    

    public void setArtifactStatsByName(final Map<String, ArtifactStats> artifactStatsByName) {
        this.artifactStatsByName = artifactStatsByName;
    }
}

