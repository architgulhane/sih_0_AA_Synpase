from Bio.Blast import NCBIWWW, NCBIXML
import asyncio

class AsyncBlastVerifier:
    @staticmethod
    async def verify_stream(sequences, cluster_df, top_n=3):
        """
        A Generator that yields results one by one.
        """
        abundance = cluster_df['cluster'].value_counts()
        top_clusters = abundance.index[abundance.index != -1][:top_n].tolist()

        for i, cluster_id in enumerate(top_clusters):
            # 1. Prepare Data
            indices = cluster_df[cluster_df['cluster'] == cluster_id].index
            cluster_seqs = [sequences[i] for i in indices]
            
            if not cluster_seqs: continue
            query_seq = max(cluster_seqs, key=len)

            # 2. Run BLAST (Blocking I/O wrapped in thread for async)
            # We use asyncio.to_thread because NCBIWWW is blocking
            blast_data = await asyncio.to_thread(AsyncBlastVerifier._run_blast_sync, query_seq)

            # 3. YIELD the result immediately (Don't wait for others)
            yield {
                "step": f"Verification {i+1}/{len(top_clusters)}",
                "cluster_id": int(cluster_id),
                "status": blast_data['status'],
                "match_percentage": blast_data['identity'],
                "description": blast_data['name']
            }

    @staticmethod
    def _run_blast_sync(sequence):
        
        try:
            result_handle = NCBIWWW.qblast("blastn", "nt", sequence, hitlist_size=1)
            blast_record = NCBIXML.read(result_handle)
            
            if blast_record.alignments:
                alignment = blast_record.alignments[0]
                hsp = alignment.hsps[0]
                identity = (hsp.identities / hsp.align_length) * 100
                name = alignment.title.split("|")[-1][:60]
                
                if identity >= 99.0: status = "KNOWN (Old)"
                elif identity >= 97.0: status = "RELATED (Old)"
                elif "uncultured" in name.lower(): status = "GHOST (Newish)"
                else: status = "NOVEL (New)"
                    
                return {"status": status, "identity": round(identity, 1), "name": name}
            else:
                return {"status": "ALIEN (New)", "identity": 0.0, "name": "No match found"}
        except Exception:
            return {"status": "ERROR", "identity": 0.0, "name": "Connection Failed"}