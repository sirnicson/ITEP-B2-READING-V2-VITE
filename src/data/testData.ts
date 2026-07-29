import type { AnswerOption, GapFillItem, Question, QuestionType, TestConfig, VocabularyItem } from '../types/test';

const configuredDuration = Number(import.meta.env.VITE_TEST_DURATION_SECONDS);

function options(questionId: string, values: string[]): AnswerOption[] {
  return values.map((text, index) => ({ id: `${questionId}-O${index + 1}`, text }));
}

function question(id: string, type: QuestionType, stem: string, values: string[], correct: number, context?: string): Question {
  return { id, type, stem, context, options: options(id, values), correctOptionId: `${id}-O${correct}` };
}

function vocab(id: string, term: string, partOfSpeech: string, meaning: string, turkishMeaning: string, simpleMeaning: string): VocabularyItem {
  return { id, term, partOfSpeech, meaning, turkishMeaning, simpleMeaning };
}

function gap(id: string, sentence: string, correctVocabularyId: string): GapFillItem {
  return { id, sentence, correctVocabularyId };
}

export const TEST_CONFIG: TestConfig = {
  id: 'itep-b2-turkish-workplace',
  title: 'B2 iTEP Essential Reading',
  subtitle: 'Turkish Workplace Edition',
  durationSeconds: Number.isFinite(configuredDuration) && configuredDuration > 0 ? configuredDuration : 1800,
  instructions: [
    'Complete each vocabulary warm-up before the reading task.',
    'The 30-minute countdown runs only while reading passages and answering questions.',
    'You may change answers, flag questions and review reading questions before submitting.',
  ],
  navigation: { allowBack: true, allowFlagging: true, allowWarmupReturn: false },
  randomization: { answerOptions: true, matchingColumns: true, gapWordBank: true },
  scoring: { pointsPerQuestion: 1 },
  sections: [
    {
      id: 'R1',
      difficulty: 'Entry B2',
      title: 'Temporary Office Relocation',
      contextLabel: 'Workplace memo',
      suggestedMinutes: 7,
      passage: `To: All employees
From: Operations Department
Subject: Temporary relocation during electrical maintenance

Beginning Monday, 14 September, the Customer Operations and Finance teams will work from the company’s Kozyatağı Training Centre. This temporary arrangement is necessary because electrical maintenance at the main office in Levent will take approximately three weeks.

The training centre is a five-minute walk from Kozyatağı Metro Station. The company shuttle, or servis, will also operate from the usual Kadıköy and Üsküdar collection points. Limited parking is available behind the building, so employees who normally drive are encouraged to use the metro or company shuttle. Reasonable public transport expenses will be reimbursed during the relocation period. Employees must keep their İstanbulkart transaction records and submit them through the expense portal by 9 October.

Working hours will remain unchanged. However, employees should arrive ten minutes early on the first day to collect temporary personnel cards. The centre has accessible entrances, lifts and restrooms. Anyone requiring additional workplace support should contact İnsan Kaynakları before Friday.

The Levent office will remain open to the IT, facilities and contracted maintenance teams. Other employees must not enter without written approval from Operations. Remote work may be approved in special cases, although it cannot be guaranteed because customer service must remain fully operational.

Managers will send updated seating plans before the move. Staff should take home personal belongings on Friday, but computers and other company equipment must remain at the Levent office. The IT team will label, record and transport these items according to the company’s asset-transfer procedure.

We understand that the relocation may cause some inconvenience. Our priority is to complete the maintenance safely while avoiding a major disruption to customers.`,
      warmup: {
        stages: ['flashcards', 'matching', 'gapfill'],
        passThreshold: 0.75,
        vocabulary: [
          vocab('R1-V01', 'relocate', 'Verb', 'Move to new place', 'Taşımak / Taşınmak', ''),
          vocab('R1-V02', 'disruption', 'Noun', 'Problem / Stopping', 'Aksama / Kesinti', ''),
          vocab('R1-V03', 'temporary', 'Adjective', 'Short-time / Not permanent', 'Geçici', ''),
          vocab('R1-V04', 'alternative', 'Noun / Adjective', 'Another option / Plan B', 'Alternatif / Başka seçenek', ''),
          vocab('R1-V05', 'reimburse', 'Verb', 'Pay back', 'Geri ödemek', ''),
          vocab('R1-V06', 'priority', 'Noun', 'Most important', 'Öncelik / En Önemli', ''),
          vocab('R1-V07', 'accessible', 'Adjective', 'Easy to reach / Easy to enter', 'Erişilebilir / Ulaşılabilir', ''),
          vocab('R1-V08', 'inconvenience', 'Noun', 'Small problem / Trouble', 'Rahatsızlık / Zorluk', ''),
        ],
        gapFill: [
          gap('R1-G01', 'The company will ___ to a Uskudar while the main office in Levent is repaired.', 'R1-V01'),
          gap('R1-G02', 'This arrangement is only ___ and will end after three weeks.', 'R1-V03'),
          gap('R1-G03', 'Employees may use any ___ bus or metro options to access the new location.', 'R1-V04'),
          gap('R1-G04', 'The company will ___ all approved public transport expenses.', 'R1-V05'),
          gap('R1-G05', 'The lift in the Uskudar office makes the building more ___ to employees who have a difficulities using the staircase.', 'R1-V07'),
          gap('R1-G06', 'Now, keeping our main ___ is to keep customer services operational.', 'R1-V06'),
          gap('R1-G07', 'Management expects some ___ during the office move.', 'R1-V02'),
          gap('R1-G08', 'So we apologize for any ___ thay this change may cause.', 'R1-V08'),
        ],
      },
      questions: [
        question('R1-Q01', 'main-idea', 'What is the main purpose of the memo?', ['To introduce permanent remote-working arrangements', 'To announce a temporary workplace change during maintenance', 'To advertise vacancies at the Kozyatağı Training Centre', 'To explain why the Finance team is closing'], 2),
        question('R1-Q02', 'main-idea', 'Which statement best summarizes the company’s plan?', ['Work will continue from another location with limited adjustments.', 'All services will stop until the electrical work is completed.', 'Only managers will work during the maintenance period.', 'Employees will choose their own schedules and locations.'], 1),
        question('R1-Q03', 'detail', 'What must employees submit to claim public transport expenses?', ['A copy of their temporary personnel card', 'A manager’s written recommendation', 'Their İstanbulkart transaction records', 'Proof that the company shuttle was full'], 3),
        question('R1-Q04', 'detail', 'What should employees do with company computers?', ['Take them home before Friday', 'Deliver them directly to İnsan Kaynakları', 'Store them behind the training centre', 'Leave them for the IT team to record and transport'], 4),
        question('R1-Q05', 'vocabulary', 'In the final paragraph, “disruption” is closest in meaning to:', ['interruption', 'expense', 'agreement', 'improvement'], 1),
        question('R1-Q06', 'vocabulary', 'In paragraph four, “guaranteed” is closest in meaning to:', ['discussed privately', 'requested formally', 'promised with certainty', 'tested successfully'], 3),
        question('R1-Q07', 'inference', 'Why can remote work not be approved for every employee?', ['The company does not have enough computers.', 'Customer service must continue operating effectively.', 'Employees must assist the maintenance contractors.', 'The training centre has no internet connection.'], 2),
        question('R1-Q08', 'inference', 'What can be inferred about parking at the training centre?', ['It is available only to Finance employees.', 'Every employee will receive a reserved space.', 'There may not be enough spaces for everyone.', 'Employees must pay a daily parking fee.'], 3),
        question('R1-Q09', 'sequencing', 'Where should the sentence be placed?', ['Position A', 'Position B', 'Position C', 'Position D'], 2, '“These cards must be shown whenever employees enter the building.”\n\nWorking hours will remain unchanged. [A] However, employees should arrive ten minutes early on the first day to collect temporary personnel cards. [B] The centre has accessible entrances, lifts and restrooms. [C] Anyone requiring additional workplace support should contact İnsan Kaynakları before Friday. [D]'),
        question('R1-Q10', 'sequencing', 'Which event is expected to happen first?', ['Employees submit their transport records.', 'The electrical maintenance is completed.', 'Managers send updated seating plans.', 'Employees begin permanent remote work.'], 3),
      ],
    },
    {
      id: 'R2',
      difficulty: 'Mid B2',
      title: 'Annual İSG Refresher Training',
      contextLabel: 'Instructions and schedule - Bursa manufacturing company',
      suggestedMinutes: 9,
      passage: `Notice issued by: İnsan Kaynakları and İSG Unit
Location: Nilüfer Production Facility, Bursa
Subject: Annual occupational health and safety refresher training

All production, warehouse, maintenance and quality-control employees must complete the annual İSG refresher programme between 5 and 16 October. The training forms part of the company’s internal occupational health and safety procedure and applies to permanent staff, temporary workers and team leaders.

Employees have been placed into morning or afternoon groups according to their shift schedules. The morning session runs from 09:00 to 12:30, while the afternoon session runs from 13:30 to 17:00. Group lists are available on the employee portal and on the noticeboard beside the main cafeteria. Employees should check both their date and location because some practical sessions will take place in Workshop B rather than the main training room.

Each session contains three parts: a review of workplace risks, a practical emergency exercise and a short digital assessment. Participants must bring their personnel cards and wear their normal protective equipment during the practical exercise. Mobile phones must be placed on silent mode. Photography is prohibited in production areas unless the İSG manager has given written approval.

Employees should arrive 15 minutes early so that the coordinator can verify attendance. Anyone arriving more than 20 minutes after the scheduled start will be recorded as absent and assigned to a replacement session. Managers may exchange employees between groups when production needs require it, but all changes must be submitted through the HR portal at least one working day in advance. Verbal arrangements with a supervisor are not sufficient.

Employees on annual leave during the training period should select a replacement date before their leave begins. Those on certified medical leave may request an exemption from the scheduled session, but they will still need to complete the training after returning to work. Previous training received from another employer does not automatically replace the company programme.

At the end of the session, participants must score at least 70 percent on the digital assessment. Anyone scoring below this level will review the relevant material with an İSG officer and repeat the assessment. A second full training session is required only if the employee fails twice.

After passing, employees must electronically acknowledge the updated emergency and incident-reporting procedures. Completion records will be stored in the personnel training system. Questions about group changes should be sent to İnsan Kaynakları; technical questions should be directed to the İSG Unit.`,
      warmup: {
        stages: ['flashcards', 'matching', 'gapfill'],
        passThreshold: 0.75,
        vocabulary: [
          vocab('R2-V01', 'mandatory', 'Adjective', 'Must do / Required', 'Zorunlu', ''),
          vocab('R2-V02', 'allocate', 'Verb', 'Give out / Set aside', 'Tahsis etmek / Ayırmak', ''),
          vocab('R2-V03', 'verify', 'Verb', 'Check / Confirm', 'Doğrulamak / Kontrol etmek', ''),
          vocab('R2-V04', 'designated', 'Adjective', 'Chosen', 'Belirlenmiş / Belirtilen', ''),
          vocab('R2-V05', 'comply', 'Verb', 'Follow rules', 'Uymak / Kurallara uymak', ''),
          vocab('R2-V06', 'postpone', 'Verb', 'Delay / Move later', 'Ertelemek', ''),
          vocab('R2-V07', 'exemption', 'Noun', 'Special excuse / Exception', 'Muafiyet / İstisna', ''),
          vocab('R2-V08', 'acknowledge', 'Verb', 'Confirm receipt / Accept', 'Onaylamak / Aldığını bildirmek', ''),
        ],
        gapFill: [
          gap('R2-G01', 'Attendance is ___ for all employees listed in the notice.', 'R2-V01'),
          gap('R2-G02', 'The coordinator will ___ each employee’s registration before the session starts.', 'R2-V03'),
          gap('R2-G03', 'Two hours have been ___ for the practical safety exercise.', 'R2-V02'),
          gap('R2-G04', 'Employees must ___ with all workshop instructions.', 'R2-V05'),
          gap('R2-G05', 'Only the ___ assembly area may be used during the evacuation exercise.', 'R2-V04'),
          gap('R2-G06', 'A manager cannot ___ training simply because the department is busy.', 'R2-V06'),
          gap('R2-G07', 'Employees on certified medical leave may request an ___.', 'R2-V07'),
          gap('R2-G08', 'Participants must ___ that they understand this revised safety rules by replying to this email.', 'R2-V08'),
        ],
      },
      questions: [
        question('R2-Q01', 'main-idea', 'What is the main purpose of the notice?', ['To explain how employees must complete annual safety training', 'To recruit new members of the İSG Unit', 'To announce changes to production shift salaries', 'To report the results of a workplace accident'], 1),
        question('R2-Q02', 'main-idea', 'Which statement best summarizes the training procedure?', ['Only new production employees need to attend.', 'Employees may complete the programme whenever convenient.', 'Relevant staff must attend an assigned session and pass an assessment.', 'Supervisors can excuse employees without recording the change.'], 3),
        question('R2-Q03', 'detail', 'What must participants use during the practical exercise?', ['A personal mobile telephone', 'Their normal protective equipment', 'Equipment borrowed from Workshop B', 'A printed copy of their assessment'], 2),
        question('R2-Q04', 'detail', 'When must a group change be submitted?', ['At least one working day before the session', 'Within 20 minutes after the session begins', 'Immediately after the employee returns from leave', 'Before the group lists are published'], 1),
        question('R2-Q05', 'vocabulary', 'In paragraph four, “verify” is closest in meaning to:', ['publish', 'confirm', 'change', 'compare'], 2),
        question('R2-Q06', 'vocabulary', 'In paragraph five, “exemption” means:', ['a request for additional payment', 'a record of poor performance', 'permission not to follow a requirement at that time', 'an invitation to join another training group'], 3),
        question('R2-Q07', 'inference', 'Why are verbal arrangements with supervisors insufficient?', ['All schedule changes must be formally recorded in the HR portal.', 'Supervisors do not know when the sessions take place.', 'Only the İSG officer can speak to temporary workers.', 'The training rooms have limited telephone service.'], 1),
        question('R2-Q08', 'inference', 'What happens to an employee who fails the assessment for the first time?', ['The employee is immediately required to repeat the entire course.', 'The employee is permanently removed from production work.', 'The employee reviews relevant material and retakes the assessment.', 'The employee receives an automatic exemption.'], 3),
        question('R2-Q09', 'sequencing', 'Where should the sentence be placed?', ['Position A', 'Position B', 'Position C', 'Position D'], 1, '“This allows the company to maintain safe staffing levels without cancelling training.”\n\nManagers may exchange employees between groups when production needs require it. [A] All changes must be submitted through the HR portal at least one working day in advance. [B] Verbal arrangements with a supervisor are not sufficient. [C] Employees on annual leave should select a replacement date. [D]'),
        question('R2-Q10', 'sequencing', 'Which sequence correctly describes successful completion?', ['Acknowledge procedures - attend training - take assessment - verify attendance', 'Verify attendance - attend three parts - pass assessment - acknowledge procedures', 'Take assessment - change groups - attend training - acknowledge procedures', 'Attend replacement session - request exemption - verify attendance - pass'], 2),
      ],
    },
    {
      id: 'R3',
      difficulty: 'Standard B2',
      title: 'Improving an E-Invoice Approval Process',
      contextLabel: 'Short workplace article - Ankara technology supplier',
      suggestedMinutes: 12,
      passage: `When AnadoluTek, an Ankara-based technology supplier, introduced a new e-invoice platform, management expected faster approvals and fewer payment errors. Yet during the first three months, the average approval time increased from four to seven working days. Suppliers began contacting the purchasing team for updates, while Finance spent additional time checking where invoices had stopped.

The company first assumed that employees needed more technical training. A review by Zeynep Demir, the process-improvement manager, found a different problem. The digital platform had copied the old paper-based procedure almost exactly. Each invoice passed through a purchasing specialist, department manager, budget controller and finance officer, regardless of its value or risk. When one approver was absent, the entire process could pause.

The review also identified duplicate controls. Purchasing staff checked whether a purchase order existed, and Finance repeated the same check before payment. Employees sometimes uploaded an invoice more than once because the system did not clearly confirm receipt. These duplicates created extra work and increased the possibility that teams would examine different versions of the same document.

Zeynep’s team redesigned the workflow rather than simply asking employees to work faster. Low-value invoices linked to an approved purchase order now follow a shorter route. The relevant department manager confirms delivery, after which Finance performs the final payment check. Higher-value or unusual transactions still require budget-controller approval. Urgent payments can be accelerated, but the requesting manager must select an exception category and provide a written reason.

The team also clarified responsibilities. Purchasing verifies supplier and purchase-order information; the receiving department confirms that goods or services were delivered; Finance checks tax details, IBAN information and payment status. Employees were instructed not to send invoice copies through personal messaging applications. Documents and comments must remain in the authorized system so that decisions are traceable and business information is handled consistently with company KVKK procedures.

Some managers initially resisted the shorter route because they believed that more approvals always created stronger control. Zeynep explained that repeated checks do not necessarily reduce risk. A control is useful when it has a clear purpose, an accountable owner and evidence that it was completed. Several approvals of the same fact may increase delay without improving the final decision.

The company introduced a dashboard showing approval time, invoices returned for correction and requests waiting at each stage. Instead of ranking individual employees publicly, department heads received weekly exception reports. This helped them identify recurring problems, such as incomplete purchase-order descriptions or managers who had not appointed delegates before taking annual leave.

After six months, average approval time had fallen to three working days, and duplicate uploads had decreased substantially. More importantly, Finance could identify who had completed each control and why an exception had been approved. The improvement came not from removing accountability, but from matching each control to the level of risk.

The experience offers a broader lesson for workplace digitalization. A company gains little by transferring an inefficient paper procedure directly onto a computer screen. Digital tools produce better results when the underlying process is examined first. Clear ownership, proportionate approval levels and traceable decisions can make a system both faster and more reliable.`,
      warmup: {
        stages: ['flashcards', 'matching', 'gapfill'],
        passThreshold: 0.7,
        vocabulary: [
            vocab('R3-V01', 'implement', 'Verb', 'Put in action / Start using', 'Uygulamak / Hayata geçirmek', ''),
            vocab('R3-V02', 'bottleneck', 'Noun', 'Slow stage / Main delay / Problem', 'Darboğaz / Tıkanıklık / Sorun', ''),
            vocab('R3-V03', 'duplicate', 'Noun / Adjective', 'Extra copy / Copy', 'Çift nüsha / Kopya', ''),
            vocab('R3-V04', 'authorize', 'Verb', 'Allow / Approve', 'Yetki vermek / Onaylamak', ''),
            vocab('R3-V05', 'traceable', 'Adjective', 'Trackable / Easy to follow', 'İzlenebilir / Takip edilebilir', ''),
            vocab('R3-V06', 'compliance', 'Noun', 'Rule-following / Obeying rules', 'Uyumluluk / Mevzuata uyma', ''),
            vocab('R3-V07', 'substantial', 'Adjective', 'Large / Big', 'Büyük miktarda', ''),
            vocab('R3-V08', 'reinforce', 'Verb', 'Make stronger / Support', 'Güçlendirmek / Pekiştirmek', ''),
            vocab('R3-V09', 'exception', 'Noun', 'Special case / Outlier', 'İstisna', ''),
            vocab('R3-V10', 'measurable', 'Adjective', 'Can be measured', 'Ölçülebilir', ''),
          ],
        gapFill: [
          gap('R3-G01', 'The company decided to ___ a revised approval workflow.', 'R3-V01'),
          gap('R3-G02', 'One manager had become a ___ because every request waited for her signature.', 'R3-V02'),
          gap('R3-G03', 'Staff sometimes uploaded a ___ copy of the same invoice.', 'R3-V03'),
          gap('R3-G04', 'Only a budget owner can ___ payment above the stated limit.', 'R3-V04'),
          gap('R3-G05', 'Every decision should be ___ through the digital system.', 'R3-V05'),
          gap('R3-G06', 'The audit team checks ___ with internal purchasing rules.', 'R3-V06'),
          gap('R3-G07', 'The change produced a ___ reduction in delayed payments.', 'R3-V07'),
          gap('R3-G08', 'Monthly reminders can ___ the correct procedure.', 'R3-V08'),
          gap('R3-G09', 'An urgent repair may be treated as an ___ to the normal process.', 'R3-V09'),
          gap('R3-G10', 'Any other revision to the revised workflow must be specific and ___.', 'R3-V10'),
        ],
      },
      questions: [
        question('R3-Q01', 'main-idea', 'What is the article mainly about?', ['How redesigning an approval process improved e-invoice handling', 'Why Turkish suppliers prefer paper invoices', 'How employees should calculate tax on international sales', 'Why AnadoluTek replaced its Finance department'], 1),
        question('R3-Q02', 'main-idea', 'Which conclusion best reflects the writer’s position?', ['More approval stages always create stronger control.', 'Digital tools work best when the underlying process is also improved.', 'All low-value payments should avoid Finance review.', 'Employee rankings are necessary for faster payment.'], 2),
        question('R3-Q03', 'detail', 'Why did employees sometimes upload invoices more than once?', ['The system did not clearly confirm that an invoice had been received.', 'Suppliers regularly changed their bank information.', 'Department managers requested personal copies.', 'The Finance team deleted all low-value invoices.'], 1),
        question('R3-Q04', 'detail', 'Who confirms that goods or services were delivered?', ['The supplier’s bank', 'The budget controller', 'The receiving department', 'The process-improvement manager'], 3),
        question('R3-Q05', 'vocabulary', 'In paragraph two, “pause” is closest in meaning to:', ['be checked twice', 'stop temporarily', 'be permanently rejected', 'become more expensive'], 2),
        question('R3-Q06', 'vocabulary', 'In paragraph five, “traceable” most nearly means:', ['possible to follow through recorded information', 'difficult for managers to understand', 'available to the public', 'automatically approved'], 1),
        question('R3-Q07', 'inference', 'Why did Zeynep oppose repeating the same control at several stages?', ['It could increase delay without providing additional risk protection.', 'Finance employees were not permitted to see purchase orders.', 'Suppliers refused to provide more than one document.', 'The platform charged for every approval action.'], 1),
        question('R3-Q08', 'inference', 'Why were weekly exception reports useful?', ['They publicly identified the slowest individual employee.', 'They removed the need for managers to appoint delegates.', 'They helped departments recognize repeated causes of delay.', 'They allowed suppliers to approve their own invoices.'], 3),
        question('R3-Q09', 'sequencing', 'Where should the sentence be placed?', ['Position A', 'Position B', 'Position C', 'Position D'], 3, '“The payment could then continue without waiting for that person to return.”\n\nDepartment heads received weekly exception reports. [A] These reports identified managers who had not appointed delegates before taking annual leave. [B] Once a delegate was formally recorded, the system could send the request to the substitute approver. [C] The dashboard also showed invoices returned for correction. [D]'),
        question('R3-Q10', 'sequencing', 'Which sequence correctly describes the improvement project?', ['Training - supplier complaints - paper workflow - dashboard', 'Longer approval times - process review - workflow redesign - improved results', 'Workflow redesign - duplicate controls - supplier review - longer delays', 'Dashboard - paper approvals - management resistance - platform purchase'], 2),
      ],
    },
  ],
};
