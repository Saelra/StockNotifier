## Flow Graph Analysis and Calculations for priceNotificatoinElement.tsx

### Flow Graph Description:
- **Node 17-32**: Initializes values:
  - Extracts `price`, `name`, `symbol`.
  - Determines `direction` and `difference`.
  - Gets `time`, `date`, and constructs `message`.
  - Retrieves `appState`.

- **Node 33**: Decision point — checks if `appState !== 'active'`.

  - **True Path**:
    - **Node 34-43**: Sends push notification:
      - Calls `Notifications.scheduleNotificationAsync`.
      - Resolves `true`.
      - Calls `saveNotificationToHistory(message)`.

  - **False Path**:
    - **Node 44**: Displays alert dialog:
      - Shows `Alert.alert`.

    - **Node 45-48**: User makes a decision:
      - **Node 49**: "Discard" — Resolves `false`.
      - **Node 50**: "Keep" — Resolves `true`.


### Cyclomatic Complexity Calculation:

1. **Method 1 (Edges - Nodes + 2):**
   - Nodes (N) = 7 (17-32, 33, 34-43, 44, 45-48, 49, 50)
   - Edges (E) = 9
   - Cyclomatic Complexity = E - N + 2 = 9 - 7 + 2 = **4**

2. **Method 2 (Predicate Nodes + 1):**
   - Predicate Nodes = 3 (Node 33, Node 45-48)
   - Cyclomatic Complexity = 3 + 1 = **4**


### Number of Regions:
In this graph, there are 4 regions:

* The initial path leading to the decision at Node 33.

* The path where appState !== 'active' leading to push notification handling.

* The path where appState === 'active', leading to the alert prompt.

* The two branches resulting from the alert prompt, either discarding or keeping the alert.


### Basis Set of Independent Paths:
1. Path 1: 17-32 → 33 (True) → 34-43 → End
2. Path 2: 17-32 → 33 (False) → 44 → 45-48 → 49 → End
3. Path 3: 17-32 → 33 (False) → 44 → 45-48 → 50 → End
4. Path 4: 17-32 → 33 (False) → 44 → End (Alert dismissed without action)



