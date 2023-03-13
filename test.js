let string = `$px1540: 0.2,
$px1440: 0.7,
$px1340: 1.3,
$px1240: 1.9,
$px1140: 2.6,
$px1040: 3.1,
$px940: 3.7,
$px840: 4.55,
$px740: 4.85,
$px640: 4.25,
$px540: 4.85,
$px440: 5.35,
$px340: 5.95,`;

string = string.split('\n');

console.log(
  string.map(item => {
    const [px, number] = item.split(' ');
    return `${px} ${(parseFloat(number) * 100 + 10) / 100}`;
  })
);
