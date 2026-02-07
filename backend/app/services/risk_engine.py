def simple_risk_engine(req):
    risk_score = 0
    factors = []

    if req.sleep < 6:
        risk_score += 20
        factors.append("Low sleep")

    if req.exercise < 2:
        risk_score += 20
        factors.append("Low physical activity")

    if req.stress > 7:
        risk_score += 20
        factors.append("High stress")

    if req.smoking:
        risk_score += 20
        factors.append("Smoking")

    if req.alcohol > 2:
        risk_score += 20
        factors.append("High alcohol intake")

    risk_level = (
        "Low" if risk_score < 30 else
        "Moderate" if risk_score < 60 else
        "High"
    )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "contributing_factors": factors,
        "bmi": getattr(req, "bmi", "Unknown")
    }
