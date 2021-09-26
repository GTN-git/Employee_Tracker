INSERT INTO department (name)
VALUES
  ('Accounting'),
  ('Sales'),
  ('Legal'),
  ('Human Resources'),
  ('Audit');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Accountant', 100000, 1),
  ('Controller', 200000, 1),
  ('Sales Manager', 300000, 2),
  ('Sales Person', 100000, 2),
  ('Lawyer', 500000, 3),
  ('Paralegal', 40000, 3),
  ('Employee Relations', 30000, 4),
  ('HR Manager', 60000, 4),
  ('Auditor', 90000, 5),
  ('Audit Manager', 150000, 5);

  INSERT INTO employee (first_name, last_name, role_id)
  VALUES
  ('Ronald', 'Firbank', 1),
  ('Virginia', 'Woolf', 2),
  ('Piers', 'Gaveston', 3),
  ('Charles', 'LeRoi', 4),
  ('Katherine', 'Mansfield', 5),
  ('Dora', 'Carrington', 6),
  ('Edward', 'Bellamy', 7),
  ('Montague', 'Summers', 8),
  ('Octavia', 'Butler', 9),
  ('Unica', 'Zurn', 10);

  UPDATE employee SET manager_id = 10 WHERE id= 9;
  UPDATE employee SET manager_id = 8 WHERE id= 7;
  UPDATE employee SET manager_id = 5 WHERE id= 6;
  UPDATE employee SET manager_id = 3 WHERE id= 4;
  UPDATE employee SET manager_id = 2 WHERE id=1;