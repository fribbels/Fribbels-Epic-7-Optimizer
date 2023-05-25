package com.fribbels.db;

import com.fribbels.core.SpecialStats;
import com.fribbels.model.ArtifactStats;
import com.fribbels.model.BaseStats;
import com.fribbels.model.HeroStats;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

public class ArtifactStatsDb {

    private Map<String, ArtifactStats> artifactStatsByName;

    public ArtifactStatsDb() {
        artifactStatsByName = new HashMap<>();
    }

    public ArtifactStats getArtifactStats(final String name, final int level) {
        if (artifactStatsByName.containsKey(name)) {
            final ArtifactStats base = artifactStatsByName.get(name);
            final float maxAttack = base.getAttack() * 13;
            final float maxHealth = base.getHealth() * 13;

            final float leveledAttack = (maxAttack - base.getAttack()) * (level / 30f) + base.getAttack();
            final float leveledHealth = (maxHealth - base.getHealth()) * (level / 30f) + base.getHealth();

            return ArtifactStats
                    .builder()
                    .attack(leveledAttack)
                    .health(leveledHealth)
                    .build();
        }

        return ArtifactStats
                .builder()
                .attack(0f)
                .health(0f)
                .build();
    }

    public void setArtifactStatsByName(final Map<String, ArtifactStats> artifactStatsByName) {
        this.artifactStatsByName = artifactStatsByName;
    }
}

