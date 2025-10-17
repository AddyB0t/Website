#!/usr/bin/env python3
"""
Script to verify and fix exercise numbering in the database based on CSV data.
This ensures exercises have proper exercise_number and display_order values.
"""

import csv
import re
from collections import defaultdict

def parse_csv_exercises(csv_path):
    """Parse CSV to get expected exercise structure."""
    chapters_exercises = defaultdict(lambda: {'name': '', 'exercises': set()})

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ch_num = row['chapter_number'].strip()
            ch_name = row['chapter_name'].strip()
            ex_name = row['exercise_name'].strip()

            if ch_num and ch_name and ex_name:
                chapters_exercises[ch_num]['name'] = ch_name
                chapters_exercises[ch_num]['exercises'].add(ex_name)

    return chapters_exercises

def extract_exercise_number(exercise_name):
    """Extract numeric part from exercise name (e.g., 'Exercise 5' -> 5)."""
    match = re.search(r'Exercise\s+(\d+)', exercise_name, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None

def generate_sql_updates(chapters_exercises):
    """Generate SQL to update exercise numbers and display orders."""
    sql_statements = []

    for ch_num, ch_data in sorted(chapters_exercises.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999):
        chapter_name = ch_data['name']
        exercises = sorted(ch_data['exercises'])

        print(f"\nChapter {ch_num}: {chapter_name}")
        print(f"  Exercises: {', '.join(exercises)}")

        for exercise_name in exercises:
            ex_num = extract_exercise_number(exercise_name)
            if ex_num:
                # Generate SQL to update this exercise
                sql = f"""
-- Update {chapter_name} - {exercise_name}
UPDATE exercises e
SET
  exercise_number = {ex_num},
  display_order = {ex_num}
FROM chapters c
WHERE e.chapter_id = c.id
  AND c.name = '{chapter_name}'
  AND c.class_level = '10'
  AND e.name = '{exercise_name}';
"""
                sql_statements.append(sql)

    return sql_statements

def main():
    csv_path = '/mnt/data/Pasia/Website/class 10th/10th-Maths/organized_10th_icse_math_questions.csv'

    print("="*80)
    print("EXERCISE STRUCTURE FROM CSV")
    print("="*80)

    chapters_exercises = parse_csv_exercises(csv_path)

    print("\n" + "="*80)
    print("GENERATED SQL UPDATES")
    print("="*80)
    print("\n-- Run these SQL statements in Supabase to fix exercise numbering:")
    print("\nBEGIN;")

    sql_statements = generate_sql_updates(chapters_exercises)

    for sql in sql_statements:
        print(sql)

    print("\nCOMMIT;")

    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print(f"Total chapters: {len(chapters_exercises)}")
    total_exercises = sum(len(ch['exercises']) for ch in chapters_exercises.values())
    print(f"Total exercises: {total_exercises}")

    # Check for non-sequential exercises
    print("\n" + "="*80)
    print("CHAPTERS WITH NON-SEQUENTIAL EXERCISE NUMBERS")
    print("="*80)

    for ch_num, ch_data in sorted(chapters_exercises.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999):
        exercises = sorted(ch_data['exercises'])
        ex_numbers = []
        for ex in exercises:
            num = extract_exercise_number(ex)
            if num:
                ex_numbers.append(num)

        ex_numbers.sort()
        expected = list(range(1, len(ex_numbers) + 1))

        if ex_numbers != expected:
            print(f"\nChapter {ch_num}: {ch_data['name']}")
            print(f"  Expected: {expected}")
            print(f"  Found: {ex_numbers}")
            print(f"  Missing: {set(expected) - set(ex_numbers)}")
            print(f"  Extra: {set(ex_numbers) - set(expected)}")

if __name__ == '__main__':
    main()
