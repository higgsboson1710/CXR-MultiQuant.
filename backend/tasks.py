from worker import celery_app
import time

@celery_app.task(bind=True)
def generate_weekly_report(self, user_id: int):
    """
    Dummy long-running task to simulate PDF report generation
    or heavy background processing.
    """
    print(f"Starting weekly report generation for User ID: {user_id}")
    
    # Simulate long process
    for i in range(1, 6):
        time.sleep(1)
        # Update state for progress tracking if needed
        self.update_state(state="PROGRESS", meta={"current": i, "total": 5})
        print(f"Generating... {i}/5")
        
    print("Report generated successfully.")
    return {"status": "Complete", "user_id": user_id, "file_url": f"/downloads/report_{user_id}.pdf"}
