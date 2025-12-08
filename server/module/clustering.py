import umap
import hdbscan
import pandas as pd
import numpy as np

class ClusterEngine:
    @staticmethod
    def run_analysis(embeddings, seed=42):
        # 1. UMAP
        reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, metric='cosine', random_state=seed, n_jobs=1)
        embedding_2d = reducer.fit_transform(embeddings)

        # 2. HDBSCAN
        clusterer = hdbscan.HDBSCAN(min_cluster_size=30, min_samples=5)
        labels = clusterer.fit_predict(embedding_2d)

        # 3. Create Stats DataFrame
        df = pd.DataFrame(embedding_2d, columns=['x', 'y'])
        df['cluster'] = labels
        return df

    @staticmethod
    def get_stats(df):
        total_seqs = len(df)
        abundance = df['cluster'].value_counts().reset_index()
        abundance.columns = ['cluster', 'count']
        abundance['percentage'] = (abundance['count'] / total_seqs) * 100
        
        # Filter valid species
        species_df = abundance[abundance['cluster'] != -1].sort_values('count', ascending=False)
        
        noise_row = abundance[abundance['cluster'] == -1]
        noise_count = int(noise_row['count'].sum()) if not noise_row.empty else 0
        noise_perc = float(noise_row['percentage'].sum()) if not noise_row.empty else 0

      
        top_groups = []
        for _, row in species_df.head(20).iterrows():
            top_groups.append({
                "group_id": int(row['cluster']),
                "count": int(row['count']),
                "percentage": round(row['percentage'], 2)
            })

        return {
            "total_reads": total_seqs,
            "total_clusters": len(species_df),
            "noise_count": noise_count,
            "noise_percentage": round(noise_perc, 2),
            "top_groups": top_groups
        }