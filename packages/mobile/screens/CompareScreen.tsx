import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
} from 'react-native';

const fmt = (v: number) => '€' + Math.round(v).toLocaleString('es-ES');

const COLORS = ['#2a6049', '#6ba88a', '#b07d3a', '#7b6fca', '#c0392b', '#2980b9'];

interface Props {
  scenarios: any[];
}

export default function CompareScreen({ scenarios }: Props) {
  const maxGross = Math.max(...scenarios.map(s => s.grossAnnual), 1);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Comparativa</Text>
      <Text style={styles.subtitle}>Salario bruto anual por escenario</Text>

      {scenarios.length < 2 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Sin datos</Text>
          <Text style={styles.emptySub}>Necesitas al menos 2 escenarios guardados para comparar.</Text>
        </View>
      ) : (
        <>
          {/* Barras */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Comparativa visual</Text>
            {scenarios.slice(0, 6).map((s, i) => (
              <View key={s.id} style={styles.barRow}>
                <Text style={styles.barLabel} numberOfLines={1}>{s.name}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.round((s.grossAnnual / maxGross) * 100)}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{fmt(s.grossAnnual)}</Text>
              </View>
            ))}
          </View>

          {/* Tabla */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalle</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>Escenario</Text>
              <Text style={styles.th}>Bruto/año</Text>
              <Text style={styles.th}>Neto/mes</Text>
            </View>
            {scenarios.map((s, i) => (
              <View key={s.id} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.td, { flex: 2, fontWeight: '500', color: '#1a1814' }]} numberOfLines={1}>
                  {s.name}
                </Text>
                <Text style={[styles.td, { color: '#2a6049', fontWeight: '500' }]}>{fmt(s.grossAnnual)}</Text>
                <Text style={styles.td}>{fmt(s.netNeeded)}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f5f0' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: '300', color: '#1a1814', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b6760', marginBottom: 24 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 22, fontWeight: '400', color: '#1a1814' },
  emptySub: { fontSize: 15, color: '#6b6760', textAlign: 'center' },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 20,
    marginBottom: 16, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '400', color: '#1a1814', marginBottom: 16 },
  barRow: { marginBottom: 14 },
  barLabel: { fontSize: 13, color: '#6b6760', marginBottom: 6 },
  barTrack: { height: 10, backgroundColor: '#f0ede8', borderRadius: 5, marginBottom: 4 },
  barFill: { height: 10, borderRadius: 5 },
  barValue: { fontSize: 13, fontWeight: '500', color: '#1a1814' },
  tableHeader: {
    flexDirection: 'row', paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#f0ede8', marginBottom: 4,
  },
  th: { flex: 1, fontSize: 11, color: '#a09d98', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '500' },
  tableRow: { flexDirection: 'row', paddingVertical: 10 },
  tableRowAlt: { backgroundColor: '#f7f5f0', borderRadius: 8 },
  td: { flex: 1, fontSize: 13, color: '#6b6760' },
});