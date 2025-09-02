import json
import sys
import os
import csv
from datetime import datetime
import argparse

def process_value(val):
    """
    Process a value for CSV output.
    If the value is a list, join it with commas.
    If it is a dict, convert it to a JSON string.
    Otherwise, convert to string.
    """
    if isinstance(val, list):
        return ", ".join(str(x) for x in val)
    elif isinstance(val, dict):
        return json.dumps(val)
    elif val is None:
        return ""
    else:
        return str(val)

def check_missing_fields(grouped_rows, fieldnames):
    """
    Check for missing required fields for each workerID and report them.
    """
    print("\n=== CHECKING FOR MISSING FIELDS ===")

    required_fields = [field for field in fieldnames if field not in ["hitId", "workerId",  "AIUsage",
        "age",
        "educationLevel",
        "sex",
        "industry",
        "professionalExperience",
        "jobTitle",
        "otherJobTitle",
        "scenariosReviewed",]]
    
    # Group by workerId to check across all their participations
    worker_data = {}
    for row in grouped_rows.values():
        worker_id = row["workerId"]
        if worker_id not in worker_data:
            worker_data[worker_id] = []
        worker_data[worker_id].append(row)
    
    missing_data_report = {}
    complete_workers = []
    
    for worker_id, worker_rows in worker_data.items():
        worker_missing = set()
        
        for row in worker_rows:
            for field in required_fields:
                if not row.get(field) or row.get(field) == "":
                    worker_missing.add(field)
        
        if worker_missing:
            missing_data_report[worker_id] = {
                "missing_fields": sorted(list(worker_missing)),
                "total_participations": len(worker_rows),
                "hit_ids": [row["hitId"] for row in worker_rows]
            }
        else:
            complete_workers.append(worker_id)
    
    # Report results
    print(f"Total unique workers: {len(worker_data)}")
    print(f"Workers with complete data: {len(complete_workers)}")
    print(f"Workers with missing data: {len(missing_data_report)}")
    
    return missing_data_report, complete_workers

def main():
    parser = argparse.ArgumentParser(
        description='Extract responses from response_march.json and output a CSV file with specified columns'
    )
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, 'response_68adf17cd4e1bf920db73a14.json')
    current_date = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file_path = os.path.join(script_dir, f"output_data_{current_date}.csv")

    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"Loaded {len(data)} entries from JSON file")
    except Exception as e:
        sys.exit(f"Error loading JSON file: {e}")

    fieldnames = [
        "hitId",
        "workerId",
        # Scenario 1 columns
        "scenario1_response_id",
        "scenario1_comment_best_human_clarity",
        "scenario1_comment_best_human_personalization",
        "scenario1_comment_best_human_effectiveness",
        "scenario1_comment_best_human_warmth",
        "scenario1_comment_best_human_overflattery",    
        "scenario1_comment_best_human_text",
        "scenario1_comment_best_human_feedback",
        "scenario1_comment_best_human_future",
        "scenario1_comment_10th_human_clarity",
        "scenario1_comment_10th_human_personalization",
        "scenario1_comment_10th_human_effectiveness",
        "scenario1_comment_10th_human_warmth",
        "scenario1_comment_10th_human_overflattery",    
        "scenario1_comment_10th_human_text",
        "scenario1_comment_10th_human_feedback",
        "scenario1_comment_10th_human_future",
        "scenario1_comment_4o_clarity",
        "scenario1_comment_4o_personalization",
        "scenario1_comment_4o_effectiveness",
        "scenario1_comment_4o_warmth",
        "scenario1_comment_4o_overflattery",            
        "scenario1_comment_4o_text",
        "scenario1_comment_4o_feedback",
        "scenario1_comment_4o_future",
        "scenario1_comment_gpt5_clarity",
        "scenario1_comment_gpt5_personalization",
        "scenario1_comment_gpt5_effectiveness",
        "scenario1_comment_gpt5_warmth",
        "scenario1_comment_gpt5_overflattery",          
        "scenario1_comment_gpt5_text",
        "scenario1_comment_gpt5_feedback",
        "scenario1_comment_gpt5_future",
        "scenario1_rankings",
        "scenario1_rankedCommentTypes",
        "scenario1_rlhf_rankings",           
        "scenario1_rlhf_rankedCommentTypes", 
        # Scenario 2 columns
        "scenario2_response_id",
        "scenario2_comment_best_human_clarity",
        "scenario2_comment_best_human_personalization",
        "scenario2_comment_best_human_effectiveness",
        "scenario2_comment_best_human_warmth",
        "scenario2_comment_best_human_overflattery",    
        "scenario2_comment_best_human_text",
        "scenario2_comment_best_human_feedback",
        "scenario2_comment_best_human_future",
        "scenario2_comment_10th_human_clarity",
        "scenario2_comment_10th_human_personalization",
        "scenario2_comment_10th_human_effectiveness",
        "scenario2_comment_10th_human_warmth",
        "scenario2_comment_10th_human_overflattery",    
        "scenario2_comment_10th_human_text",
        "scenario2_comment_10th_human_feedback",
        "scenario2_comment_10th_human_future",
        "scenario2_comment_4o_clarity",
        "scenario2_comment_4o_personalization",
        "scenario2_comment_4o_effectiveness",
        "scenario2_comment_4o_warmth",
        "scenario2_comment_4o_overflattery",            
        "scenario2_comment_4o_text",
        "scenario2_comment_4o_feedback",
        "scenario2_comment_4o_future",
        "scenario2_comment_gpt5_clarity",
        "scenario2_comment_gpt5_personalization",
        "scenario2_comment_gpt5_effectiveness",
        "scenario2_comment_gpt5_warmth",
        "scenario2_comment_gpt5_overflattery",          
        "scenario2_comment_gpt5_text",
        "scenario2_comment_gpt5_feedback",
        "scenario2_comment_gpt5_future",
        "scenario2_rankings",
        "scenario2_rankedCommentTypes",
        "scenario2_rlhf_rankings",           
        "scenario2_rlhf_rankedCommentTypes", 
        # Demographic/common fields
        "AIUsage",
        "age",
        "educationLevel",
        "sex",
        "industry",
        "professionalExperience",
        "jobTitle",
        "otherJobTitle",
        "scenariosReviewed",
        # Global AI question fields (not response_id dependent)
        "selectedAIResponses",
        "selectedCommentTypes"
    ]
    
    # First, organize data by (hitId, workerId) and collect all response_ids
    participant_data = {}
    
    for entry in data:
        hitId = entry.get("hitId")
        workerId = entry.get("workerId")
        response_id = entry.get("response_id")
        
        if not hitId or not workerId:
            continue
            
        key = (hitId, workerId)
        
        if key not in participant_data:
            participant_data[key] = {
                "response_ids": set(),
                "entries": []
            }
        
        if response_id:
            participant_data[key]["response_ids"].add(response_id)
        
        participant_data[key]["entries"].append(entry)

    print(f"\nFound {len(participant_data)} unique (hitId, workerId) pairs")

    grouped_rows = {}

    for key, participant in participant_data.items():
        hitId, workerId = key
        response_ids = sorted(list(participant["response_ids"]))
        
        if len(response_ids) == 0:
            question_titles = [entry.get("questionTitle", "N/A") for entry in participant["entries"]]
            unique_questions = list(set(question_titles))
            print(f"Skipping {key} - has no response_ids. Completed questions: {unique_questions}")
            continue
        elif len(response_ids) == 1:
            scenario1_id = response_ids[0]
            scenario2_id = None
        else:
            scenario1_id = response_ids[0]
            scenario2_id = response_ids[1]
        
        grouped_rows[key] = {
            "hitId": process_value(hitId),
            "workerId": process_value(workerId),
            "scenario1_response_id": process_value(scenario1_id) if scenario1_id else "",
            "scenario2_response_id": process_value(scenario2_id) if scenario2_id else "",
        }
        
        # Initialization
        for scenario in ["scenario1", "scenario2"]:
            for comment_type in ["comment_best_human", "comment_10th_human", "comment_4o", "comment_gpt5"]:
                for attribute in ["clarity", "personalization", "effectiveness", "warmth", "overflattery", "text", "feedback", "future"]:
                    grouped_rows[key][f"{scenario}_{comment_type}_{attribute}"] = ""
            grouped_rows[key][f"{scenario}_rankings"] = ""
            grouped_rows[key][f"{scenario}_rankedCommentTypes"] = ""
            grouped_rows[key][f"{scenario}_rlhf_rankings"] = ""           
            grouped_rows[key][f"{scenario}_rlhf_rankedCommentTypes"] = ""
        
        grouped_rows[key]["AIUsage"] = ""
        grouped_rows[key]["age"] = ""
        grouped_rows[key]["educationLevel"] = ""
        grouped_rows[key]["sex"] = ""
        grouped_rows[key]["industry"] = ""
        grouped_rows[key]["professionalExperience"] = ""
        grouped_rows[key]["jobTitle"] = ""          
        grouped_rows[key]["otherJobTitle"] = ""     
        grouped_rows[key]["scenariosReviewed"] = ""
        grouped_rows[key]["selectedAIResponses"] = ""
        grouped_rows[key]["selectedCommentTypes"] = ""
        
        # Process all entries for this participant
        for entry in participant["entries"]:
            question_title = entry.get("questionTitle", "")
            entry_response_id = entry.get("response_id")
            
            if question_title == "AIQuestion":
                if "selectedAIResponses" in entry and entry["selectedAIResponses"] not in [None, ""]:
                    grouped_rows[key]["selectedAIResponses"] = process_value(entry["selectedAIResponses"])
                
                if "selectedCommentTypes" in entry and entry["selectedCommentTypes"] not in [None, ""]:
                    grouped_rows[key]["selectedCommentTypes"] = process_value(entry["selectedCommentTypes"])
            
            # Handle other common fields regardless of response_id
            if "AIUsage" in entry and entry["AIUsage"] not in [None, ""]:
                grouped_rows[key]["AIUsage"] = process_value(entry["AIUsage"])
            
            if "age" in entry and entry["age"] not in [None, ""]:
                grouped_rows[key]["age"] = process_value(entry["age"])
                
            if "educationLevel" in entry and entry["educationLevel"] not in [None, ""]:
                grouped_rows[key]["educationLevel"] = process_value(entry["educationLevel"])
                
            if "sex" in entry and entry["sex"] not in [None, ""]:
                grouped_rows[key]["sex"] = process_value(entry["sex"])
                
            if "industry" in entry and entry["industry"] not in [None, ""]:
                grouped_rows[key]["industry"] = process_value(entry["industry"])
                
            if "professionalExperience" in entry and entry["professionalExperience"] not in [None, ""]:
                grouped_rows[key]["professionalExperience"] = process_value(entry["professionalExperience"])
                
            if "jobTitle" in entry and entry["jobTitle"] not in [None, ""]:
                grouped_rows[key]["jobTitle"] = process_value(entry["jobTitle"])
                
            if "otherJobTitle" in entry and entry["otherJobTitle"] not in [None, ""]:
                grouped_rows[key]["otherJobTitle"] = process_value(entry["otherJobTitle"])
                
            if "scenariosReviewed" in entry and entry["scenariosReviewed"] not in [None, ""]:
                grouped_rows[key]["scenariosReviewed"] = process_value(entry["scenariosReviewed"])
            
            # Handle response_id dependent data (scenarios)
            if entry_response_id:
                scenario_prefix = None
                if entry_response_id == scenario1_id:
                    scenario_prefix = "scenario1"
                elif entry_response_id == scenario2_id:
                    scenario_prefix = "scenario2"
                
                if scenario_prefix:
                    if question_title == "CompareResponses":
                        if "rankings" in entry and entry["rankings"] not in [None, ""]:
                            grouped_rows[key][f"{scenario_prefix}_rankings"] = process_value(entry["rankings"])
                            print(f"DEBUG: Setting {scenario_prefix}_rankings for {workerId}: {entry['rankings']}")
                            
                        if "rankedCommentTypes" in entry and entry["rankedCommentTypes"] not in [None, ""]:
                            grouped_rows[key][f"{scenario_prefix}_rankedCommentTypes"] = process_value(entry["rankedCommentTypes"])
                            print(f"DEBUG: Setting {scenario_prefix}_rankedCommentTypes for {workerId}: {entry['rankedCommentTypes']}")
                    
                    elif question_title == "RLHFQuestions":
                        if "rankings" in entry and entry["rankings"] not in [None, ""]:
                            grouped_rows[key][f"{scenario_prefix}_rlhf_rankings"] = process_value(entry["rankings"])
                            print(f"DEBUG: Setting {scenario_prefix}_rlhf_rankings for {workerId}: {entry['rankings']}")
                            
                        if "rankedCommentTypes" in entry and entry["rankedCommentTypes"] not in [None, ""]:
                            grouped_rows[key][f"{scenario_prefix}_rlhf_rankedCommentTypes"] = process_value(entry["rankedCommentTypes"])
                            print(f"DEBUG: Setting {scenario_prefix}_rlhf_rankedCommentTypes for {workerId}: {entry['rankedCommentTypes']}")

                    elif question_title == "ResponseRating":
                        ratings = entry.get("ratings", {})
                        response = entry.get("response", {})
                        feedback = entry.get("feedback", {})
                        
                        if isinstance(response, dict):
                            comment_type = response.get("response_comment_type", "")
                            
                            if comment_type in ["comment_best_human", "comment_10th_human", "comment_4o", "comment_gpt5"]:
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_clarity"] = process_value(ratings.get("clarity", ""))
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_personalization"] = process_value(ratings.get("personalization", ""))
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_effectiveness"] = process_value(ratings.get("effectiveness", ""))
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_warmth"] = process_value(ratings.get("warmth", ""))
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_overflattery"] = process_value(ratings.get("overflattery", ""))  
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_text"] = process_value(response.get("text", ""))
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_feedback"] = process_value(feedback)
                                grouped_rows[key][f"{scenario_prefix}_{comment_type}_future"] = process_value(ratings.get("future", ""))

    print(f"Created {len(grouped_rows)} complete participant rows")
    
    # Filter rows that have required demographic data
    all_rows = list(grouped_rows.values())

    # Run completion checking functions on all data first
    missing_report, complete_workers = check_missing_fields(grouped_rows, fieldnames)

    # Filter to only include COMPLETE rows (no missing fields)
    print(f"\n=== FILTERING TO COMPLETE ROWS ONLY ===")

    workers_with_missing_fields = set(missing_report.keys()) if missing_report else set()

    complete_rows_only = []
    
    for row in all_rows:
        has_sex = row.get("sex") and row.get("sex") != ""
        worker_id = row["workerId"]
        has_missing_fields = worker_id in workers_with_missing_fields
        if has_sex and not has_missing_fields:
            complete_rows_only.append(row)
    rows_with_sex_count = len([row for row in all_rows if row.get("sex") and row.get("sex") != ""])
    rows_complete_count = len([row for row in all_rows if row["workerId"] not in workers_with_missing_fields])
    
    print(f"Total participants: {len(all_rows)}")
    print(f"Participants with sex field: {rows_with_sex_count}")
    print(f"Participants with complete data (no missing fields): {rows_complete_count}")
    print(f"Participants with BOTH sex field AND complete data: {len(complete_rows_only)}")
    excluded_no_sex = len(all_rows) - rows_with_sex_count
    excluded_missing_fields = rows_with_sex_count - len(complete_rows_only)
    
    print(f"\nExcluded participants:")
    print(f"  - Missing sex field: {excluded_no_sex}")
    print(f"  - Have sex but missing other fields: {excluded_missing_fields}")
    print(f"  - Total excluded: {len(all_rows) - len(complete_rows_only)}")

    filtered_rows = complete_rows_only

    print(f"\n=== FINAL CSV ROWS VERIFICATION ===")
    print(f"Rows being written to CSV: {len(filtered_rows)}")
    
    # Verify no rows have missing fields (should be 0)
    csv_rows_with_missing = []
    for row in filtered_rows:
        worker_id = row["workerId"]
        if worker_id in workers_with_missing_fields:
            csv_rows_with_missing.append(worker_id)
    
    if csv_rows_with_missing:
        print(f"ERROR: {len(csv_rows_with_missing)} rows still have missing fields!")
        print(f"This should not happen - check filtering logic.")
    else:
        print(" All rows in final CSV have complete data!")

    # Write the rows into CSV
    try:
        with open(output_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in filtered_rows:
                writer.writerow(row)
        
        print(f"\n=== FINAL SUMMARY ===")
        print(f"CSV output written to: {output_file_path}")
        print(f"Total rows written to CSV: {len(filtered_rows)}")
        print(f"All rows are COMPLETE (no missing fields)")
        
    except Exception as e:
        sys.exit(f"Error writing output file: {e}")

if __name__ == '__main__':
    main()
