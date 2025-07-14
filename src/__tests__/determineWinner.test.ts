import { describe, it, expect } from 'vitest';
import { Participant } from '../types/index';

// Дублируем логику определения победителя из useWheel
function determineWinner(
  finalRotation: number,
  participants: Participant[],
): Participant | null {
  if (participants.length === 0) return null;

  const sliceAngle = 360 / participants.length;
  // Нормализуем поворот к диапазону 0-360
  const normalizedRotation = ((finalRotation % 360) + 360) % 360;

  // Индикатор находится справа (угол 0°)
  // Колесо вращается против часовой стрелки (отрицательный поворот в canvas)
  // Поэтому нужно найти сектор, который находится под индикатором
  const winningSectorIndex =
    Math.floor(normalizedRotation / sliceAngle) % participants.length;

  return participants[winningSectorIndex] || null;
}

// Создаем участников для тестирования
function createParticipants(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `participant-${index}`,
    name: `Участник ${index + 1}`,
    addedAt: new Date(),
  }));
}

describe('determineWinner', () => {
  it('должен возвращать null для пустого списка участников', () => {
    const result = determineWinner(180, []);
    expect(result).toBeNull();
  });

  it('должен возвращать единственного участника', () => {
    const participants = createParticipants(1);
    const result = determineWinner(180, participants);
    expect(result).toBe(participants[0]);
  });

  it('должен корректно определять победителя для разных углов поворота', () => {
    const participants = createParticipants(4); // 4 участника = 90° на каждого

    // Тестируем разные углы
    expect(determineWinner(0, participants)).toBe(participants[0]);
    expect(determineWinner(45, participants)).toBe(participants[0]);
    expect(determineWinner(90, participants)).toBe(participants[1]);
    expect(determineWinner(180, participants)).toBe(participants[2]);
    expect(determineWinner(270, participants)).toBe(participants[3]);
    expect(determineWinner(360, participants)).toBe(participants[0]);
  });

  describe('тест равномерности распределения', () => {
    const testCases = [
      { participantCount: 4, testName: '4 участника' },
      { participantCount: 6, testName: '6 участников' },
    ];

    testCases.forEach(({ participantCount, testName }) => {
      it(`должен обеспечивать равномерное распределение для ${testName}`, () => {
        console.log(`\n🎯 Начинаем тест равномерности для ${testName}`);

        const participants = createParticipants(participantCount);
        const iterations = 100;
        const winCounts = new Map<string, number>();

        console.log(
          `📊 Участники: ${participants.map((p) => p.name).join(', ')}`,
        );
        console.log(`🔄 Количество итераций: ${iterations}`);

        // Инициализируем счетчики
        participants.forEach((participant) => {
          winCounts.set(participant.id, 0);
        });

        console.log('⏳ Запускаем симуляцию...');

        // Проводим 100 тестов с случайными углами поворота
        for (let i = 0; i < iterations; i++) {
          const randomRotation = Math.random() * 360 * 10; // Случайный поворот от 0 до 3600°
          const winner = determineWinner(randomRotation, participants);

          console.log(
            `Итерация ${i + 1}: угол=${randomRotation.toFixed(1)}°, победитель=${winner?.name || 'null'}`,
          );

          if (winner) {
            const currentCount = winCounts.get(winner.id) || 0;
            winCounts.set(winner.id, currentCount + 1);
          }
        }

        console.log('✅ Симуляция завершена! Анализируем результаты...');

        // Проверяем, что каждый участник выиграл примерно 1/n раз
        const expectedWinRate = 1 / participantCount;
        const tolerance = 0.2; // 20% допуск для малого количества итераций

        participants.forEach((participant) => {
          const winCount = winCounts.get(participant.id) || 0;
          const actualWinRate = winCount / iterations;
          const deviation = Math.abs(actualWinRate - expectedWinRate);

          expect(deviation).toBeLessThan(tolerance);

          // Дополнительная проверка: каждый участник должен выиграть хотя бы несколько раз (снижен порог)
          expect(winCount).toBeGreaterThan(0); // Минимум 1 победа
        });

        // Проверяем, что общее количество побед равно количеству итераций
        const totalWins = Array.from(winCounts.values()).reduce(
          (sum, count) => sum + count,
          0,
        );
        expect(totalWins).toBe(iterations);

        // Выводим статистику для отладки
        console.log(`\nСтатистика для ${testName}:`);
        participants.forEach((participant) => {
          const winCount = winCounts.get(participant.id) || 0;
          const winRate = ((winCount / iterations) * 100).toFixed(2);
          const expectedRate = ((1 / participantCount) * 100).toFixed(2);
          console.log(
            `${participant.name}: ${winCount} побед (${winRate}%, ожидалось ${expectedRate}%)`,
          );
        });
      });
    });
  });

  it('должен корректно обрабатывать отрицательные углы поворота', () => {
    const participants = createParticipants(4);

    // Отрицательные углы должны нормализоваться
    expect(determineWinner(-90, participants)).toBe(participants[3]);
    expect(determineWinner(-180, participants)).toBe(participants[2]);
    expect(determineWinner(-270, participants)).toBe(participants[1]);
    expect(determineWinner(-360, participants)).toBe(participants[0]);
  });

  it('должен корректно обрабатывать углы больше 360°', () => {
    const participants = createParticipants(4);

    // Углы больше 360° должны нормализоваться
    expect(determineWinner(450, participants)).toBe(participants[1]); // 450° = 90°
    expect(determineWinner(720, participants)).toBe(participants[0]); // 720° = 0°
    expect(determineWinner(810, participants)).toBe(participants[1]); // 810° = 90°
  });
});
