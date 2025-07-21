import { simpleHandoffScenario } from './simpleHandoff';
import { customerServiceRetailScenario } from './customerServiceRetail';
import { chatSupervisorScenario } from './chatSupervisor';
import { totemMercadoScenario } from './totemMercado';

import type { RealtimeAgent } from '@openai/agents/realtime';

export const allAgentSets: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  totemMercado: totemMercadoScenario,
};

export const defaultAgentSetKey = 'chatSupervisor';