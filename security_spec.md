# Security Specification

## 1. Data Invariants
- Products must contain a valid ID, title/name under 200 chars, valid price >= 0, and valid image data.
- Site settings must contain store name under 120 chars.
- Orders must contain customer name, valid total >= 0, and items list. Orders can be created by customers at checkout.
- All document IDs must conform to `isValidId` ('^[a-zA-Z0-9_\\-]+$', <= 128 chars).

## 2. The Dirty Dozen Payloads
1. Product with oversized ID: `{ id: 'a'.repeat(200), name: 'Shirt', price: 10 }` -> DENIED
2. Product with negative price: `{ id: 'p1', name: 'Shirt', price: -5 }` -> DENIED
3. Product with missing required fields: `{ id: 'p1' }` -> DENIED
4. Product with invalid characters in ID: `{ id: '../../bad', name: 'Shirt' }` -> DENIED
5. Order with negative total: `{ id: 'ord1', customerName: 'Alex', grandTotal: -10 }` -> DENIED
6. Order missing customer name: `{ id: 'ord1', grandTotal: 50 }` -> DENIED
7. Order with corrupted status string: `{ id: 'ord1', customerName: 'Alex', grandTotal: 50, status: 12345 }` -> DENIED
8. Settings with empty or oversized store name: `{ storeName: 'a'.repeat(300) }` -> DENIED
9. Settings with invalid logoHeight type: `{ storeName: 'Shop', logoHeight: 'huge' }` -> DENIED
10. Unbounded rogue collection access: `/arbitrary/{doc}` -> DENIED
11. Document update injecting non-whitelisted keys on locked documents -> DENIED
12. Malicious injection in order tracking: `/orders/{invalid/path}` -> DENIED
