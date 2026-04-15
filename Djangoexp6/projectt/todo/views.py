import json
import os
from datetime import datetime
from django.shortcuts import redirect, render

DB = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'students.json')

def load_students():
    if not os.path.exists(DB):
        return []
    with open(DB, 'r') as f:
        return json.load(f)

def save_students(students):
    with open(DB, 'w') as f:
        json.dump(students, f, indent=2)

def index(request):
    filter_by = request.GET.get('filter', 'all')
    students = load_students()

    if filter_by == 'pass':
        filtered = [s for s in students if s['status'] == 'Pass']
    elif filter_by == 'fail':
        filtered = [s for s in students if s['status'] == 'Fail']
    else:
        filtered = students

    return render(request, 'todo/index.html', {'students': filtered, 'filter': filter_by})

def add_student(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        roll_no = request.POST.get('roll_no', '').strip()
        department = request.POST.get('department', '').strip()
        marks = request.POST.get('marks', '').strip()

        if name and roll_no and department and marks:
            students = load_students()
            marks = int(marks)
            students.append({
                'id': int(datetime.now().timestamp() * 1000),
                'name': name,
                'roll_no': roll_no,
                'department': department,
                'marks': marks,
                'status': 'Pass' if marks >= 40 else 'Fail',
                'enrolled_on': datetime.now().strftime('%Y-%m-%d')
            })
            save_students(students)
    return redirect('/')

def edit_student(request, student_id):
    students = load_students()
    student = next((s for s in students if s['id'] == student_id), None)

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        roll_no = request.POST.get('roll_no', '').strip()
        department = request.POST.get('department', '').strip()
        marks = int(request.POST.get('marks', 0))

        for s in students:
            if s['id'] == student_id:
                s['name'] = name
                s['roll_no'] = roll_no
                s['department'] = department
                s['marks'] = marks
                s['status'] = 'Pass' if marks >= 40 else 'Fail'
                break
        save_students(students)
        return redirect('/')

    return render(request, 'todo/edit.html', {'student': student})

def delete_student(request, student_id):
    students = [s for s in load_students() if s['id'] != student_id]
    save_students(students)
    return redirect('/')
